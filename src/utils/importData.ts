import {
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import Papa from 'papaparse';

import { INITIAL_CATEGORIES } from '@/config';
import {
  Expense,
  ExpenseCategory,
  Member,
  PersonalExpense,
  SplitMode,
} from '@/types';

export type ParsedImportResult = {
  format: 'json' | 'csv';
  filename: string;
  payload: {
    personalExpenses: PersonalExpense[];
    expenses: Expense[];
    members: Member[];
    categories: ExpenseCategory[];
  };
  summary: {
    personalCount: number;
    groupCount: number;
    memberCount: number;
    categoryCount: number;
  };
};

/**
 * Opens system document picker for JSON or CSV backup files.
 * Returns null if user cancels dialog.
 */
export async function pickBackupFile(): Promise<{
  uri: string;
  name: string;
  type: string | null;
} | null> {
  try {
    const [res] = await pick({
      type: [types.json, types.csv, types.plainText],
      allowMultiSelection: false,
    });

    return {
      uri: res.uri,
      name: res.name || 'imported_file',
      type: res.type,
    };
  } catch (err) {
    if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
      return null;
    }

    throw err;
  }
}

/**
 * Reads local text file content from URI.
 */
export async function readTextFile(uri: string): Promise<string> {
  const response = await fetch(uri);
  return await response.text();
}

/**
 * Parses JSON backup payload exported from EquiSplit.
 */
export function parseJsonBackup(
  content: string,
  filename: string = 'backup.json',
): ParsedImportResult {
  const parsed = JSON.parse(content);
  const data = parsed?.data ?? parsed;

  const personalExpenses: PersonalExpense[] = Array.isArray(
    data.personalExpenses,
  )
    ? data.personalExpenses.map((pe: any, idx: number) => ({
        id: String(pe.id || `imported_pe_${Date.now()}_${idx}`),
        title: String(pe.title || 'Personal Expense'),
        amount: Number(pe.amount) || 0,
        type: pe.type === 'income' ? 'income' : 'expense',
        categoryId: String(pe.categoryId || 'others'),
        date: Number(pe.date) || Date.now(),
        note: pe.note ? String(pe.note) : undefined,
        createdAt: Number(pe.createdAt) || Date.now(),
        updatedAt: Number(pe.updatedAt) || Date.now(),
      }))
    : [];

  const expenses: Expense[] = Array.isArray(data.expenses)
    ? data.expenses.map((e: any, idx: number) => ({
        id: String(e.id || `imported_exp_${Date.now()}_${idx}`),
        title: String(e.title || 'Group Expense'),
        totalAmount: Number(e.totalAmount) || 0,
        splitMode: (e.splitMode as SplitMode) || 'equally',
        categoryId: String(e.categoryId || 'others'),
        payers: Array.isArray(e.payers)
          ? e.payers.map((p: any) => ({
              memberId: String(p.memberId),
              amount: Number(p.amount) || 0,
            }))
          : [],
        participants: Array.isArray(e.participants)
          ? e.participants.map((p: any) => ({
              memberId: String(p.memberId),
              share: Number(p.share) || 0,
            }))
          : [],
        createdAt: Number(e.createdAt) || Date.now(),
        updatedAt: Number(e.updatedAt) || Date.now(),
      }))
    : [];

  const members: Member[] = Array.isArray(data.members)
    ? data.members.map((m: any, idx: number) => ({
        id: String(m.id || `imported_m_${Date.now()}_${idx}`),
        name: String(m.name || `Member ${idx + 1}`),
        isPrimary: Boolean(m.isPrimary),
      }))
    : [];

  const categories: ExpenseCategory[] = Array.isArray(data.categories)
    ? data.categories.map((c: any) => ({
        id: String(c.id),
        name: String(c.name || 'Category'),
        iconKey: String(c.iconKey || 'more-horizontal'),
        color: String(c.color || '#94A3B8'),
      }))
    : [];

  return {
    format: 'json',
    filename,
    payload: {
      personalExpenses,
      expenses,
      members,
      categories,
    },
    summary: {
      personalCount: personalExpenses.length,
      groupCount: expenses.length,
      memberCount: members.length,
      categoryCount: categories.length,
    },
  };
}

/**
 * Helper to extract amounts inside parentheses, e.g. "Bob (₹450.00)" or "Bob (450)"
 */
function parseNameAndAmount(
  str: string,
): { name: string; amount: number } | null {
  const trimmed = str.trim();
  const match = trimmed.match(/^(.*?)\s*\([^\d]*([\d.,]+)\)$/);
  if (match) {
    const name = match[1].trim();
    const amount = parseFloat(match[2].replace(/,/g, ''));
    if (name && !isNaN(amount)) {
      return { name, amount };
    }
  }
  return null;
}

/**
 * Parses CSV backup exported from EquiSplit (Personal, Group, or Complete).
 */
export function parseCsvBackup(
  content: string,
  filename: string = 'backup.csv',
  existingCategories: ExpenseCategory[] = INITIAL_CATEGORIES,
): ParsedImportResult {
  const result = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = result.data;
  if (!rows || rows.length === 0) {
    return {
      format: 'csv',
      filename,
      payload: {
        personalExpenses: [],
        expenses: [],
        members: [],
        categories: [],
      },
      summary: {
        personalCount: 0,
        groupCount: 0,
        memberCount: 0,
        categoryCount: 0,
      },
    };
  }

  const firstRow = rows[0];
  const keys = Object.keys(firstRow);
  const isComplete = keys.includes('Record Type');
  const isGroup = keys.some(
    k => k.includes('Total Amount') || k.includes('Split Mode'),
  );
  const isPersonal =
    keys.includes('Type') && keys.some(k => k.includes('Amount'));

  const personalExpenses: PersonalExpense[] = [];
  const expenses: Expense[] = [];
  const membersMap = new Map<string, Member>();

  const getOrCreateMember = (name: string): Member => {
    const trimmed = name.trim();
    const existing = membersMap.get(trimmed.toLowerCase());
    if (existing) return existing;
    const member: Member = {
      id: `imported_m_${Date.now()}_${membersMap.size}`,
      name: trimmed,
    };
    membersMap.set(trimmed.toLowerCase(), member);
    return member;
  };

  const findCategoryId = (catName?: string): string => {
    if (!catName) return 'others';
    const match = existingCategories.find(
      c => c.name.toLowerCase() === catName.trim().toLowerCase(),
    );
    return match ? match.id : 'others';
  };

  const amountKey =
    keys.find(k => k.toLowerCase().includes('amount')) || 'Amount';

  rows.forEach((row, idx) => {
    const recordType = row['Record Type'] || (isGroup ? 'Group' : 'Personal');
    const dateStr = row.Date || '';
    const dateTimestamp = dateStr ? new Date(dateStr).getTime() : Date.now();
    const validDate = isNaN(dateTimestamp) ? Date.now() : dateTimestamp;
    const title = row.Title || `Imported Record ${idx + 1}`;
    const rawAmount = parseFloat(
      String(row[amountKey] || '0').replace(/[^0-9.-]/g, ''),
    );
    const amount = isNaN(rawAmount) ? 0 : Math.abs(rawAmount);
    const categoryName = row.Category;
    const categoryId = findCategoryId(categoryName);

    if (recordType === 'Personal' || (!isComplete && isPersonal)) {
      const typeStr = (
        row.Type ||
        row['Type / Split Mode'] ||
        'Expense'
      ).toLowerCase();
      const type = typeStr.includes('income') ? 'income' : 'expense';
      const note = row.Note || row['Participants / Note'] || undefined;

      personalExpenses.push({
        id: `imported_pe_${Date.now()}_${idx}`,
        title,
        amount,
        type,
        categoryId,
        date: validDate,
        note,
        createdAt: validDate,
        updatedAt: Date.now(),
      });
    } else {
      // Group record
      const splitModeRaw = (
        row['Split Mode'] ||
        row['Type / Split Mode'] ||
        'equally'
      ).toLowerCase();
      let splitMode: SplitMode = 'equally';
      if (splitModeRaw.includes('exact') || splitModeRaw.includes('amount'))
        splitMode = 'amount';
      else if (splitModeRaw.includes('share')) splitMode = 'shares';
      else if (splitModeRaw.includes('item')) splitMode = 'perItem';
      else if (splitModeRaw.includes('settle')) splitMode = 'settlement';

      const paidByStr = row['Paid By'] || '';
      const payers: { memberId: string; amount: number }[] = [];
      paidByStr.split(';').forEach(chunk => {
        const parsedPayer = parseNameAndAmount(chunk);
        if (parsedPayer) {
          const m = getOrCreateMember(parsedPayer.name);
          payers.push({ memberId: m.id, amount: parsedPayer.amount });
        }
      });

      const participantsStr =
        row['Participants & Shares'] || row['Participants / Note'] || '';
      const participants: { memberId: string; share: number }[] = [];
      participantsStr.split(';').forEach(chunk => {
        const parsedPart = parseNameAndAmount(chunk);
        if (parsedPart) {
          const m = getOrCreateMember(parsedPart.name);
          participants.push({ memberId: m.id, share: parsedPart.amount });
        }
      });

      // If payers or participants were not parsable from text, default to self
      if (payers.length === 0 && amount > 0) {
        const defaultMember = getOrCreateMember('Member');
        payers.push({ memberId: defaultMember.id, amount });
      }
      if (participants.length === 0 && amount > 0) {
        const defaultMember = getOrCreateMember('Member');
        participants.push({ memberId: defaultMember.id, share: amount });
      }

      expenses.push({
        id: `imported_exp_${Date.now()}_${idx}`,
        title,
        totalAmount: amount,
        splitMode,
        categoryId,
        payers,
        participants,
        createdAt: validDate,
        updatedAt: Date.now(),
      });
    }
  });

  const members = Array.from(membersMap.values());

  return {
    format: 'csv',
    filename,
    payload: {
      personalExpenses,
      expenses,
      members,
      categories: [],
    },
    summary: {
      personalCount: personalExpenses.length,
      groupCount: expenses.length,
      memberCount: members.length,
      categoryCount: 0,
    },
  };
}

/**
 * Parses either JSON or CSV file content based on filename or contents.
 */
export function parseImportContent(
  content: string,
  filename: string,
  existingCategories: ExpenseCategory[] = INITIAL_CATEGORIES,
): ParsedImportResult {
  const trimmed = content.trim();
  if (
    filename.toLowerCase().endsWith('.json') ||
    trimmed.startsWith('{') ||
    trimmed.startsWith('[')
  ) {
    return parseJsonBackup(trimmed, filename);
  }
  return parseCsvBackup(trimmed, filename, existingCategories);
}
