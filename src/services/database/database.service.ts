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

export async function clearAllTransactions(): Promise<void> {
  const db = getDb();
  await db.execute('DELETE FROM expenses;');
  await db.execute('DELETE FROM personal_expenses;');
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

// ---------------------------------------------------------------------------
// Import Merge (Non-destructive)
// ---------------------------------------------------------------------------

export interface MergeImportSummary {
  membersAdded: number;
  membersSkipped: number;
  categoriesAdded: number;
  categoriesSkipped: number;
  personalExpensesAdded: number;
  personalExpensesSkipped: number;
  expensesAdded: number;
  expensesSkipped: number;
}

export interface MergeImportResult {
  summary: MergeImportSummary;
  members: Member[];
  categories: ExpenseCategory[];
  expenses: Expense[];
  personalExpenses: PersonalExpense[];
}

function toDateKey(timestamp: number): string {
  try {
    const d = new Date(timestamp);
    if (isNaN(d.getTime())) return '';
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  } catch {
    return '';
  }
}

/**
 * Safely merges imported members, categories, personal expenses, and group expenses into SQLite.
 *
 * Rules:
 * 1. Existing data is NEVER overwritten, modified, or deleted.
 * 2. If a record already exists (matching ID or matching fingerprint), it is skipped.
 * 3. Members are mapped case-insensitively by name to existing members.
 * 4. Payer and participant member IDs are remapped appropriately.
 * 5. Returns updated fresh DB records and an operation summary.
 */
export async function mergeImportedRecords(payload: {
  personalExpenses?: PersonalExpense[];
  expenses?: Expense[];
  members?: Member[];
  categories?: ExpenseCategory[];
}): Promise<MergeImportResult> {
  const summary: MergeImportSummary = {
    membersAdded: 0,
    membersSkipped: 0,
    categoriesAdded: 0,
    categoriesSkipped: 0,
    personalExpensesAdded: 0,
    personalExpensesSkipped: 0,
    expensesAdded: 0,
    expensesSkipped: 0,
  };

  // 1. Fetch all existing records from DB (read-only baseline)
  let existingMembers = await getMembers();
  let existingCategories = await getCategories();
  const existingExpenses = await getExpenses();
  const existingPersonalExpenses = await getPersonalExpenses();

  const hasPrimaryMember = existingMembers.some(m => m.isPrimary);

  // Mappings for imported IDs -> target IDs in DB
  const memberIdMap = new Map<string, string>();
  const categoryIdMap = new Map<string, string>();

  // Map of existing members by lowercased name
  const existingMemberByName = new Map<string, Member>();
  existingMembers.forEach(m => {
    existingMemberByName.set(m.name.trim().toLowerCase(), m);
  });
  const existingMemberIdSet = new Set<string>(existingMembers.map(m => m.id));

  // 2. Merge Categories
  const importedCategories = payload.categories || [];
  const existingCatByName = new Map<string, ExpenseCategory>();
  existingCategories.forEach(c => {
    existingCatByName.set(c.name.trim().toLowerCase(), c);
  });
  const existingCatIdSet = new Set<string>(existingCategories.map(c => c.id));

  for (const cat of importedCategories) {
    const catNameKey = (cat.name || '').trim().toLowerCase();
    const existingByName = catNameKey ? existingCatByName.get(catNameKey) : undefined;
    const existingById = existingCatIdSet.has(cat.id);

    if (existingByName) {
      categoryIdMap.set(cat.id, existingByName.id);
      summary.categoriesSkipped++;
    } else if (existingById) {
      categoryIdMap.set(cat.id, cat.id);
      summary.categoriesSkipped++;
    } else {
      const newCat: ExpenseCategory = {
        id: cat.id || `imported_cat_${Date.now()}_${summary.categoriesAdded}`,
        name: cat.name || 'Custom Category',
        iconKey: cat.iconKey || 'other',
        color: cat.color || '#94A3B8',
        isDefault: false,
      };
      await addCategory(newCat);
      categoryIdMap.set(cat.id, newCat.id);
      existingCatByName.set(newCat.name.trim().toLowerCase(), newCat);
      existingCatIdSet.add(newCat.id);
      summary.categoriesAdded++;
    }
  }

  // Reload categories if any were added
  if (summary.categoriesAdded > 0) {
    existingCategories = await getCategories();
  }

  // 3. Merge Members
  const importedMembers = payload.members || [];
  for (const member of importedMembers) {
    const nameKey = (member.name || '').trim().toLowerCase();
    if (!nameKey) {
      summary.membersSkipped++;
      continue;
    }

    const existingByName = existingMemberByName.get(nameKey);
    if (existingByName) {
      memberIdMap.set(member.id, existingByName.id);
      summary.membersSkipped++;
    } else {
      let targetId = member.id;
      if (existingMemberIdSet.has(targetId)) {
        targetId = `imported_m_${Date.now()}_${summary.membersAdded}`;
      }
      const isPrimary =
        !hasPrimaryMember && summary.membersAdded === 0 && Boolean(member.isPrimary);
      const newMember: Member = {
        id: targetId,
        name: member.name.trim(),
        isPrimary,
      };
      await addMember(newMember);
      memberIdMap.set(member.id, targetId);
      existingMemberByName.set(nameKey, newMember);
      existingMemberIdSet.add(targetId);
      summary.membersAdded++;
    }
  }

  // Reload members if any were added
  if (summary.membersAdded > 0) {
    existingMembers = await getMembers();
  }
  const fallbackMemberId = existingMembers[0]?.id || 'primary_user';

  // 4. Merge Personal Expenses
  const importedPersonalExpenses = payload.personalExpenses || [];
  const existingPeIdSet = new Set<string>(existingPersonalExpenses.map(pe => pe.id));
  const existingPeFingerprintSet = new Set<string>(
    existingPersonalExpenses.map(
      pe =>
        `${pe.title.trim().toLowerCase()}_${pe.amount.toFixed(2)}_${toDateKey(pe.date)}_${pe.type}`,
    ),
  );

  for (const pe of importedPersonalExpenses) {
    const fingerprint = `${(pe.title || '').trim().toLowerCase()}_${(Number(pe.amount) || 0).toFixed(2)}_${toDateKey(pe.date)}_${pe.type}`;
    if (existingPeIdSet.has(pe.id) || existingPeFingerprintSet.has(fingerprint)) {
      summary.personalExpensesSkipped++;
      continue;
    }

    let targetId = pe.id;
    if (existingPeIdSet.has(targetId) || !targetId) {
      targetId = `imported_pe_${Date.now()}_${summary.personalExpensesAdded}`;
    }

    const mappedCategoryId = pe.categoryId
      ? categoryIdMap.get(pe.categoryId) || pe.categoryId
      : 'others';

    const newPersonalExpense: PersonalExpense = {
      id: targetId,
      title: pe.title || 'Personal Expense',
      amount: Math.abs(Number(pe.amount) || 0),
      type: pe.type === 'income' ? 'income' : 'expense',
      categoryId: mappedCategoryId,
      date: Number(pe.date) || Date.now(),
      note: pe.note ? String(pe.note) : undefined,
      createdAt: Number(pe.createdAt) || Number(pe.date) || Date.now(),
      updatedAt: Date.now(),
    };

    await addPersonalExpense(newPersonalExpense);
    existingPeIdSet.add(targetId);
    existingPeFingerprintSet.add(fingerprint);
    summary.personalExpensesAdded++;
  }

  // 5. Merge Group Expenses
  const importedExpenses = payload.expenses || [];
  const existingExpIdSet = new Set<string>(existingExpenses.map(e => e.id));
  const existingExpFingerprintSet = new Set<string>(
    existingExpenses.map(
      e =>
        `${e.title.trim().toLowerCase()}_${e.totalAmount.toFixed(2)}_${toDateKey(e.createdAt)}`,
    ),
  );

  for (const exp of importedExpenses) {
    const fingerprint = `${(exp.title || '').trim().toLowerCase()}_${(Number(exp.totalAmount) || 0).toFixed(2)}_${toDateKey(exp.createdAt)}`;
    if (existingExpIdSet.has(exp.id) || existingExpFingerprintSet.has(fingerprint)) {
      summary.expensesSkipped++;
      continue;
    }

    let targetId = exp.id;
    if (existingExpIdSet.has(targetId) || !targetId) {
      targetId = `imported_exp_${Date.now()}_${summary.expensesAdded}`;
    }

    const mappedCategoryId = exp.categoryId
      ? categoryIdMap.get(exp.categoryId) || exp.categoryId
      : 'general';

    const mappedPayers: PayerContribution[] = (exp.payers || []).map(p => ({
      memberId:
        memberIdMap.get(p.memberId) ||
        (existingMemberIdSet.has(p.memberId) ? p.memberId : fallbackMemberId),
      amount: Math.abs(Number(p.amount) || 0),
    }));

    const mappedParticipants: ParticipantShare[] = (exp.participants || []).map(p => ({
      memberId:
        memberIdMap.get(p.memberId) ||
        (existingMemberIdSet.has(p.memberId) ? p.memberId : fallbackMemberId),
      share: Math.abs(Number(p.share) || 0),
    }));

    if (mappedPayers.length === 0 && exp.totalAmount > 0) {
      mappedPayers.push({
        memberId: fallbackMemberId,
        amount: Number(exp.totalAmount) || 0,
      });
    }
    if (mappedParticipants.length === 0 && exp.totalAmount > 0) {
      mappedParticipants.push({
        memberId: fallbackMemberId,
        share: Number(exp.totalAmount) || 0,
      });
    }

    const newExpense: Expense = {
      id: targetId,
      title: exp.title || 'Group Expense',
      totalAmount: Math.abs(Number(exp.totalAmount) || 0),
      splitMode: exp.splitMode || 'equally',
      categoryId: mappedCategoryId,
      payers: mappedPayers,
      participants: mappedParticipants,
      items: exp.items,
      createdAt: Number(exp.createdAt) || Date.now(),
      updatedAt: Date.now(),
    };

    await addExpense(newExpense);
    existingExpIdSet.add(targetId);
    existingExpFingerprintSet.add(fingerprint);
    summary.expensesAdded++;
  }

  // 6. Return fresh data directly from DB alongside summary
  const [freshMembers, freshCategories, freshExpenses, freshPersonalExpenses] =
    await Promise.all([
      getMembers(),
      getCategories(),
      getExpenses(),
      getPersonalExpenses(),
    ]);

  return {
    summary,
    members: freshMembers,
    categories: freshCategories,
    expenses: freshExpenses,
    personalExpenses: freshPersonalExpenses,
  };
}

