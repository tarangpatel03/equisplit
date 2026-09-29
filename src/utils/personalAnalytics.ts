import { ExpenseCategory, PersonalExpense } from "@/types";

export type TimePeriod = "this_month" | "last_month" | "all";

export type PersonalCategorySpending = {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  transactionCount: number;
};

export type PersonalAnalyticsResult = {
  totalInflow: number;
  totalOutflow: number;
  netBalance: number;
  totalSpending: number;
  categoryBreakdown: PersonalCategorySpending[];
  hasExpenses: boolean;
};

export function getTimePeriodBounds(
  period: TimePeriod,
  referenceDate = new Date(),
): { start: number; end: number } | null {
  if (period === "all") return null;

  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  if (period === "this_month") {
    const start = new Date(year, month, 1, 0, 0, 0, 0).getTime();
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();
    return { start, end };
  }

  if (period === "last_month") {
    const start = new Date(year, month - 1, 1, 0, 0, 0, 0).getTime();
    const end = new Date(year, month, 0, 23, 59, 59, 999).getTime();
    return { start, end };
  }

  return null;
}

export function resolveCategory(
  id: string | undefined,
  categories: ExpenseCategory[],
): ExpenseCategory {
  if (id === 'settlement') {
    return {
      id: 'settlement',
      name: 'Settlement',
      iconKey: 'handshake',
      color: '#10B981',
    };
  }
  const fallback =
    categories.find(c => c.id === "other" || c.id === "others") ??
    categories[0] ?? {
      id: id || "other",
      name: "Other",
      iconKey: "more-horizontal",
      color: "#94A3B8",
    };
  if (!id || id === "general") return fallback;
  return categories.find(c => c.id === id) ?? fallback;
}

export function computePersonalAnalytics(
  expenses: PersonalExpense[],
  categories: ExpenseCategory[],
  period: TimePeriod = "this_month",
  referenceDate = new Date(),
): PersonalAnalyticsResult {
  const bounds = getTimePeriodBounds(period, referenceDate);

  const filtered = expenses.filter(exp => {
    if (!bounds) return true;
    return exp.date >= bounds.start && exp.date <= bounds.end;
  });

  let totalInflow = 0;
  let totalOutflow = 0;
  const categoryMap: Record<string, { amount: number; count: number }> = {};

  for (const item of filtered) {
    if (item.type === "income") {
      totalInflow += item.amount;
    } else {
      totalOutflow += item.amount;
      const catId = item.categoryId || "other";
      if (!categoryMap[catId]) {
        categoryMap[catId] = { amount: 0, count: 0 };
      }
      categoryMap[catId].amount += item.amount;
      categoryMap[catId].count += 1;
    }
  }

  totalInflow = Math.round(totalInflow * 100) / 100;
  totalOutflow = Math.round(totalOutflow * 100) / 100;

  const categoryBreakdown: PersonalCategorySpending[] = Object.entries(categoryMap)
    .filter(([_, data]) => data.amount > 0)
    .map(([catId, data]) => {
      const category = resolveCategory(catId, categories);
      const percentage =
        totalOutflow > 0 ? (data.amount / totalOutflow) * 100 : 0;
      return {
        category,
        amount: Math.round(data.amount * 100) / 100,
        percentage: Math.round(percentage * 10) / 10,
        transactionCount: data.count,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return {
    totalInflow,
    totalOutflow,
    netBalance: Math.round((totalInflow - totalOutflow) * 100) / 100,
    totalSpending: totalOutflow,
    categoryBreakdown,
    hasExpenses: filtered.some(e => e.type === "expense"),
  };
}
