/**
 * SQLite Database Service
 *
 * Source of truth for all persistent data (members + expenses).
 * Screens never call this directly — use the exported functions.
 * Redux is a read cache on top of this.
 */

import { open } from '@op-engineering/op-sqlite';

import { INITIAL_CATEGORIES } from '@/config';
import {
  Expense,
  ExpenseCategory,
  ExpenseItem,
  Member,
  ParticipantShare,
  PayerContribution,
  SplitMode,
} from '@/types';

const DB_NAME = 'splitwise.db';

// Singleton DB instance — opened once on app start.
let db: ReturnType<typeof open> | null = null;

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

// ---------------------------------------------------------------------------
// Init & Migrations
// ---------------------------------------------------------------------------

export async function initDatabase(): Promise<void> {
  db = open({ name: DB_NAME });

  await db.execute(`
    CREATE TABLE IF NOT EXISTS members (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      total_amount REAL NOT NULL,
      split_mode TEXT NOT NULL,
      category_id TEXT DEFAULT 'general',
      payers TEXT NOT NULL,
      participants TEXT NOT NULL,
      items TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // Migration: Ensure category_id column exists on pre-existing expenses table
  try {
    const tableInfo = await db.execute('PRAGMA table_info(expenses);');
    const hasCategoryId = tableInfo.rows?.some(
      (col: Record<string, unknown>) => col.name === 'category_id',
    );
    if (!hasCategoryId) {
      await db.execute(
        "ALTER TABLE expenses ADD COLUMN category_id TEXT DEFAULT 'general';",
      );
    }
  } catch (err) {
    console.warn('[DB] category_id column migration check:', err);
  }

  // Categories Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      icon_key TEXT NOT NULL,
      color TEXT NOT NULL,
      is_default INTEGER DEFAULT 0
    );
  `);

  // Seed default categories if table is empty
  try {
    const catCheck = await db.execute(
      'SELECT COUNT(*) as count FROM categories;',
    );
    const count = (catCheck.rows?.[0]?.count as number) ?? 0;
    if (count === 0) {
      for (const cat of INITIAL_CATEGORIES) {
        await db.execute(
          'INSERT INTO categories (id, name, icon_key, color, is_default) VALUES (?, ?, ?, ?, ?);',
          [cat.id, cat.name, cat.iconKey, cat.color, cat.isDefault ? 1 : 0],
        );
      }
    }
  } catch (err) {
    console.warn('[DB] category seeding check:', err);
  }
}

// ---------------------------------------------------------------------------
// Members
// ---------------------------------------------------------------------------

export async function getMembers(): Promise<Member[]> {
  const result = await getDb().execute('SELECT id, name FROM members ORDER BY name ASC;');
  return result.rows.map(row => ({
    id: row.id as string,
    name: row.name as string,
  }));
}

export async function addMember(member: Member): Promise<void> {
  await getDb().execute('INSERT INTO members (id, name) VALUES (?, ?);', [
    member.id,
    member.name,
  ]);
}

export async function removeMember(id: string): Promise<void> {
  await getDb().execute('DELETE FROM members WHERE id = ?;', [id]);
}

// ---------------------------------------------------------------------------
// Expenses
// ---------------------------------------------------------------------------

function rowToExpense(row: Record<string, unknown>): Expense {
  return {
    id: row.id as string,
    title: row.title as string,
    totalAmount: row.total_amount as number,
    splitMode: row.split_mode as SplitMode,
    categoryId: (row.category_id as string) || 'general',
    payers: JSON.parse(row.payers as string) as PayerContribution[],
    participants: JSON.parse(row.participants as string) as ParticipantShare[],
    items: row.items ? (JSON.parse(row.items as string) as ExpenseItem[]) : undefined,
    createdAt: row.created_at as number,
    updatedAt: row.updated_at as number,
  };
}

export async function getExpenses(): Promise<Expense[]> {
  const result = await getDb().execute(
    'SELECT * FROM expenses ORDER BY created_at DESC;',
  );
  return result.rows.map(rowToExpense);
}

export async function addExpense(expense: Expense): Promise<void> {
  await getDb().execute(
    `INSERT INTO expenses
      (id, title, total_amount, split_mode, category_id, payers, participants, items, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      expense.id,
      expense.title,
      expense.totalAmount,
      expense.splitMode,
      expense.categoryId || 'general',
      JSON.stringify(expense.payers),
      JSON.stringify(expense.participants),
      expense.items ? JSON.stringify(expense.items) : null,
      expense.createdAt,
      expense.updatedAt,
    ],
  );
}

export async function updateExpense(expense: Expense): Promise<void> {
  await getDb().execute(
    `UPDATE expenses
     SET title = ?, total_amount = ?, split_mode = ?, category_id = ?, payers = ?, participants = ?, items = ?, updated_at = ?
     WHERE id = ?;`,
    [
      expense.title,
      expense.totalAmount,
      expense.splitMode,
      expense.categoryId || 'general',
      JSON.stringify(expense.payers),
      JSON.stringify(expense.participants),
      expense.items ? JSON.stringify(expense.items) : null,
      expense.updatedAt,
      expense.id,
    ],
  );
}

export async function deleteExpense(id: string): Promise<void> {
  await getDb().execute('DELETE FROM expenses WHERE id = ?;', [id]);
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function getCategories(): Promise<ExpenseCategory[]> {
  const result = await getDb().execute(
    'SELECT id, name, icon_key, color, is_default FROM categories ORDER BY is_default DESC, name ASC;',
  );
  return (result.rows ?? []).map(row => ({
    id: row.id as string,
    name: row.name as string,
    iconKey: (row.icon_key as string) || 'other',
    color: (row.color as string) || '#94A3B8',
    isDefault: Boolean(row.is_default),
  }));
}

export async function addCategory(category: ExpenseCategory): Promise<void> {
  await getDb().execute(
    'INSERT INTO categories (id, name, icon_key, color, is_default) VALUES (?, ?, ?, ?, ?);',
    [
      category.id,
      category.name,
      category.iconKey,
      category.color,
      category.isDefault ? 1 : 0,
    ],
  );
}

export async function updateCategory(category: ExpenseCategory): Promise<void> {
  await getDb().execute(
    'UPDATE categories SET name = ?, icon_key = ?, color = ? WHERE id = ?;',
    [category.name, category.iconKey, category.color, category.id],
  );
}

export async function deleteCategory(id: string): Promise<void> {
  // Reassign any expenses belonging to this category to 'others'
  await getDb().execute(
    "UPDATE expenses SET category_id = 'others' WHERE category_id = ?;",
    [id],
  );
  await getDb().execute('DELETE FROM categories WHERE id = ?;', [id]);
}
