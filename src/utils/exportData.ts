import { Share } from 'react-native';
import Papa from 'papaparse';

import {
  Expense,
  ExpenseCategory,
  Member,
  PersonalExpense,
  SplitMode,
} from '@/types';

export type ExportScope = 'personal' | 'group' | 'complete';
export type ExportFormat = 'csv' | 'json';

export type ExportPayload = {
  members: Member[];
  categories: ExpenseCategory[];
  expenses: Expense[];
  personalExpenses: PersonalExpense[];
};

export type ExportResult = {
  content: string;
  filename: string;
  mimeType: string;
};

/**
 * Formats epoch timestamp (ms) to YYYY-MM-DD date string.
 */
export function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getCategoryName(
  categoryId: string | undefined,
  categories: ExpenseCategory[],
): string {
  if (!categoryId) return 'General';
  const cat = categories.find(c => c.id === categoryId);
  return cat ? cat.name : 'General';
}

export function getMemberName(memberId: string, members: Member[]): string {
  const m = members.find(item => item.id === memberId);
  return m ? m.name : 'Unknown';
}

export function formatSplitMode(splitMode: SplitMode): string {
  switch (splitMode) {
    case 'equally':
      return 'Equally';
    case 'amount':
      return 'Exact Amount';
    case 'shares':
      return 'By Shares';
    case 'perItem':
      return 'Per Item';
    case 'settlement':
      return 'Settlement';
    default:
      return splitMode;
  }
}

/**
 * Converts personal expenses to a CSV string using PapaParse.
 */
export function exportPersonalExpensesCsv(
  personalExpenses: PersonalExpense[],
  categories: ExpenseCategory[],
): string {
  if (personalExpenses.length === 0) {
    return 'Date,Type,Category,Title,Amount (INR),Note\n';
  }

  const rows = personalExpenses.map(pe => ({
    'Date': formatDate(pe.date),
    'Type': pe.type === 'income' ? 'Income' : 'Expense',
    'Category': getCategoryName(pe.categoryId, categories),
    'Title': pe.title,
    'Amount (INR)': pe.amount,
    'Note': pe.note ?? '',
  }));

  return Papa.unparse(rows, { header: true });
}

/**
 * Converts group expenses to a CSV string using PapaParse.
 */
export function exportGroupExpensesCsv(
  expenses: Expense[],
  members: Member[],
  categories: ExpenseCategory[],
  currencySymbol: string = '₹',
  currencyCode: string = 'INR',
): string {
  if (expenses.length === 0) {
    return `Date,Category,Title,Total Amount (${currencyCode}),Split Mode,Paid By,Participants & Shares\n`;
  }

  const rows = expenses.map(e => {
    const paidByStr = e.payers
      .map(p => `${getMemberName(p.memberId, members)} (${currencySymbol}${p.amount.toFixed(2)})`)
      .join('; ');

    const participantsStr = e.participants
      .map(
        p => `${getMemberName(p.memberId, members)} (${currencySymbol}${p.share.toFixed(2)})`,
      )
      .join('; ');

    return {
      'Date': formatDate(e.createdAt),
      'Category': getCategoryName(e.categoryId, categories),
      'Title': e.title,
      [`Total Amount (${currencyCode})`]: e.totalAmount,
      'Split Mode': formatSplitMode(e.splitMode),
      'Paid By': paidByStr,
      'Participants & Shares': participantsStr,
    };
  });

  return Papa.unparse(rows, { header: true });
}

/**
 * Converts complete data (both personal and group expenses) to a unified CSV log.
 */
export function exportCompleteBackupCsv(
  payload: ExportPayload,
  currencySymbol: string = '₹',
  currencyCode: string = 'INR',
): string {
  const { personalExpenses, expenses, members, categories } = payload;

  const personalRows = personalExpenses.map(pe => ({
    'Record Type': 'Personal',
    'Date': formatDate(pe.date),
    'Category': getCategoryName(pe.categoryId, categories),
    'Title': pe.title,
    'Type / Split Mode': pe.type === 'income' ? 'Income' : 'Expense',
    [`Amount (${currencyCode})`]: pe.amount,
    'Paid By': 'Self',
    'Shares / Note': pe.note ?? '',
  }));

  const groupRows = expenses.map(e => ({
    'Record Type': 'Group',
    'Date': formatDate(e.createdAt),
    'Category': getCategoryName(e.categoryId, categories),
    'Title': e.title,
    'Type / Split Mode': formatSplitMode(e.splitMode),
    [`Amount (${currencyCode})`]: e.totalAmount,
    'Paid By': e.payers
      .map(p => `${getMemberName(p.memberId, members)} (${currencySymbol}${p.amount.toFixed(2)})`)
      .join('; '),
    'Shares / Note': e.participants
      .map(
        p => `${getMemberName(p.memberId, members)} (${currencySymbol}${p.share.toFixed(2)})`,
      )
      .join('; '),
  }));

  const allRows = [...personalRows, ...groupRows];
  if (allRows.length === 0) {
    return `Record Type,Date,Category,Title,Type / Split Mode,Amount (${currencyCode}),Paid By,Shares / Note\n`;
  }

  // Sort by date descending
  allRows.sort((a, b) => b.Date.localeCompare(a.Date));

  return Papa.unparse(allRows, { header: true });
}

/**
 * Formats data into a structured JSON string.
 */
export function exportToJson(
  scope: ExportScope,
  payload: ExportPayload,
): string {
  const meta = {
    appName: 'EquiSplit',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    scope,
  };

  let dataPayload: Record<string, unknown>;

  switch (scope) {
    case 'personal':
      dataPayload = {
        personalExpenses: payload.personalExpenses,
        categories: payload.categories,
      };
      break;
    case 'group':
      dataPayload = {
        expenses: payload.expenses,
        members: payload.members,
        categories: payload.categories,
      };
      break;
    case 'complete':
    default:
      dataPayload = {
        members: payload.members,
        categories: payload.categories,
        expenses: payload.expenses,
        personalExpenses: payload.personalExpenses,
      };
      break;
  }

  return JSON.stringify({ ...meta, data: dataPayload }, null, 2);
}

/**
 * Generates the export content, filename, and mimeType according to scope and format.
 */
export function generateExportData(
  scope: ExportScope,
  format: ExportFormat,
  payload: ExportPayload,
  currencySymbol: string = '₹',
  currencyCode: string = 'INR',
): ExportResult {
  const dateStr = formatDate(Date.now());

  if (format === 'json') {
    const content = exportToJson(scope, payload);
    const filename = `equisplit_${scope}_backup_${dateStr}.json`;
    return {
      content,
      filename,
      mimeType: 'application/json',
    };
  }

  // CSV
  let content = '';
  switch (scope) {
    case 'personal':
      content = exportPersonalExpensesCsv(
        payload.personalExpenses,
        payload.categories,
      );
      break;
    case 'group':
      content = exportGroupExpensesCsv(
        payload.expenses,
        payload.members,
        payload.categories,
        currencySymbol,
        currencyCode,
      );
      break;
    case 'complete':
    default:
      content = exportCompleteBackupCsv(payload, currencySymbol, currencyCode);
      break;
  }

  const filename = `equisplit_${scope}_expenses_${dateStr}.csv`;
  return {
    content,
    filename,
    mimeType: 'text/csv',
  };
}

/**
 * Triggers native system share dialog for exported data.
 */
export async function shareExportedData(
  exportResult: ExportResult,
): Promise<void> {
  const { content, filename } = exportResult;
  await Share.share({
    title: filename,
    message: content,
  });
}
