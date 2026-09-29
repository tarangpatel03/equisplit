/**
 * SQLite Database Service
 *
 * Source of truth for all persistent data (members + expenses + personal expenses).
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
  PersonalExpense,
  PersonalExpenseType,
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
      name TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0
    );
  `);

  // Migration: Ensure is_primary column exists on pre-existing members table
  try {
    const memberInfo = await db.execute('PRAGMA table_info(members);');
    const hasIsPrimary = memberInfo.rows?.some(
      (col: Record<string, unknown>) => col.name === 'is_primary',
    );
    if (!hasIsPrimary) {
      await db.execute(
        'ALTER TABLE members ADD COLUMN is_primary INTEGER DEFAULT 0;',
      );
    }
  } catch (err) {
    console.warn('[DB] is_primary column migration check:', err);
  }

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

  // Personal Expenses Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS personal_expenses (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT DEFAULT 'expense',
      category_id TEXT DEFAULT 'general',
      date INTEGER NOT NULL,
      note TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  // Migration: Ensure type column exists on pre-existing personal_expenses table
  try {
    const personalInfo = await db.execute('PRAGMA table_info(personal_expenses);');
    const hasType = personalInfo.rows?.some(
      (col: Record<string, unknown>) => col.name === 'type',
    );
    if (!hasType) {
      await db.execute(
        "ALTER TABLE personal_expenses ADD COLUMN type TEXT DEFAULT 'expense';",
      );
    }
  } catch (err) {
    console.warn('[DB] personal_expenses type column migration check:', err);
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
  const result = await getDb().execute(
    'SELECT id, name, is_primary FROM members ORDER BY is_primary DESC, name ASC;',
  );
  return (result.rows ?? []).map(row => ({
    id: row.id as string,
    name: row.name as string,
    isPrimary: Boolean(row.is_primary),
  }));
}

export async function addMember(member: Member): Promise<void> {
  await getDb().execute(
    'INSERT INTO members (id, name, is_primary) VALUES (?, ?, ?);',
    [member.id, member.name, member.isPrimary ? 1 : 0],
  );
}

export async function removeMember(id: string): Promise<void> {
  await getDb().execute('DELETE FROM members WHERE id = ?;', [id]);
}

export async function setPrimaryMember(memberId: string): Promise<void> {
  await getDb().execute(
    'UPDATE members SET is_primary = CASE WHEN id = ? THEN 1 ELSE 0 END;',
    [memberId],
  );
}

export async function getPrimaryMemberId(): Promise<string | null> {
  const result = await getDb().execute(
    'SELECT id FROM members WHERE is_primary = 1 LIMIT 1;',
  );
  return (result.rows?.[0]?.id as string) ?? null;
}

// ---------------------------------------------------------------------------
// Group Expenses
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
  return (result.rows ?? []).map(rowToExpense);
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
// Personal Expenses
// ---------------------------------------------------------------------------

function rowToPersonalExpense(row: Record<string, unknown>): PersonalExpense {
  return {
    id: row.id as string,
    title: row.title as string,
    amount: row.amount as number,
    type: (row.type as PersonalExpenseType) || 'expense',
    categoryId: (row.category_id as string) || 'general',
    date: row.date as number,
    note: (row.note as string) || undefined,
    createdAt: row.created_at as number,
    updatedAt: row.updated_at as number,
  };
}

export async function getPersonalExpenses(): Promise<PersonalExpense[]> {
  const result = await getDb().execute(
    'SELECT * FROM personal_expenses ORDER BY date DESC, created_at DESC;',
  );
  return (result.rows ?? []).map(rowToPersonalExpense);
}

export async function addPersonalExpense(expense: PersonalExpense): Promise<void> {
  await getDb().execute(
    `INSERT INTO personal_expenses
      (id, title, amount, type, category_id, date, note, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      expense.id,
      expense.title,
      expense.amount,
      expense.type || 'expense',
      expense.categoryId || 'general',
      expense.date,
      expense.note ?? null,
      expense.createdAt,
      expense.updatedAt,
    ],
  );
}

export async function updatePersonalExpense(expense: PersonalExpense): Promise<void> {
  await getDb().execute(
    `UPDATE personal_expenses
     SET title = ?, amount = ?, type = ?, category_id = ?, date = ?, note = ?, updated_at = ?
     WHERE id = ?;`,
    [
      expense.title,
      expense.amount,
      expense.type || 'expense',
      expense.categoryId || 'general',
      expense.date,
      expense.note ?? null,
      expense.updatedAt,
      expense.id,
    ],
  );
}

export async function deletePersonalExpense(id: string): Promise<void> {
  await getDb().execute('DELETE FROM personal_expenses WHERE id = ?;', [id]);
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
  // Reassign any group and personal expenses belonging to this category to 'others'
  await getDb().execute(
    "UPDATE expenses SET category_id = 'others' WHERE category_id = ?;",
    [id],
  );
  await getDb().execute(
    "UPDATE personal_expenses SET category_id = 'others' WHERE category_id = ?;",
    [id],
  );
  await getDb().execute('DELETE FROM categories WHERE id = ?;', [id]);
}
