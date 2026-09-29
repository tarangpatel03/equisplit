import { ExpenseCategory } from "../src/types/category.types";
import { PersonalExpense } from "../src/types/expense.types";
import {
  computePersonalAnalytics,
  getTimePeriodBounds,
} from "../src/utils/personalAnalytics";

const mockCategories: ExpenseCategory[] = [
  { id: "food", name: "Food & Drinks", iconKey: "utensils", color: "#FF6B6B" },
  { id: "travel", name: "Transportation", iconKey: "car", color: "#4ECDC4" },
  { id: "health", name: "Health", iconKey: "heart", color: "#95E1D3" },
  { id: "other", name: "Other", iconKey: "more-horizontal", color: "#94A3B8" },
];

describe("personalAnalytics", () => {
  const refDate = new Date("2026-09-28T12:00:00Z");

  it("calculates accurate month bounds", () => {
    const thisMonth = getTimePeriodBounds("this_month", refDate);
    expect(thisMonth).not.toBeNull();
    const startDate = new Date(thisMonth!.start);
    expect(startDate.getFullYear()).toBe(2026);
    expect(startDate.getMonth()).toBe(8); // September (0-indexed)
    expect(startDate.getDate()).toBe(1);

    const lastMonth = getTimePeriodBounds("last_month", refDate);
    expect(lastMonth).not.toBeNull();
    const lastMonthStart = new Date(lastMonth!.start);
    expect(lastMonthStart.getMonth()).toBe(7); // August
    expect(lastMonthStart.getDate()).toBe(1);

    const all = getTimePeriodBounds("all", refDate);
    expect(all).toBeNull();
  });

  it("computes personal inflow, outflow, and category breakdown correctly", () => {
    const now = refDate.getTime();
    const lastMonthDate = new Date("2026-08-15T12:00:00Z").getTime();

    const mockExpenses: PersonalExpense[] = [
      {
        id: "p1",
        title: "Salary",
        amount: 50000,
        type: "income",
        categoryId: "income",
        date: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "p2",
        title: "Groceries",
        amount: 2000,
        type: "expense",
        categoryId: "food",
        date: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "p3",
        title: "Dinner",
        amount: 1000,
        type: "expense",
        categoryId: "food",
        date: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "p4",
        title: "Uber",
        amount: 1000,
        type: "expense",
        categoryId: "travel",
        date: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "p5",
        title: "August Gym",
        amount: 1500,
        type: "expense",
        categoryId: "health",
        date: lastMonthDate,
        createdAt: lastMonthDate,
        updatedAt: lastMonthDate,
      },
    ];

    // This Month Test
    const thisMonthResult = computePersonalAnalytics(
      mockExpenses,
      mockCategories,
      "this_month",
      refDate,
    );

    expect(thisMonthResult.totalInflow).toBe(50000);
    expect(thisMonthResult.totalOutflow).toBe(4000); // 2000 + 1000 + 1000
    expect(thisMonthResult.netBalance).toBe(46000);
    expect(thisMonthResult.hasExpenses).toBe(true);

    // Food should be 3000 (75%), Travel should be 1000 (25%)
    expect(thisMonthResult.categoryBreakdown).toHaveLength(2);
    expect(thisMonthResult.categoryBreakdown[0].category.id).toBe("food");
    expect(thisMonthResult.categoryBreakdown[0].amount).toBe(3000);
    expect(thisMonthResult.categoryBreakdown[0].percentage).toBe(75);
    expect(thisMonthResult.categoryBreakdown[0].transactionCount).toBe(2);

    expect(thisMonthResult.categoryBreakdown[1].category.id).toBe("travel");
    expect(thisMonthResult.categoryBreakdown[1].amount).toBe(1000);
    expect(thisMonthResult.categoryBreakdown[1].percentage).toBe(25);

    // Last Month Test
    const lastMonthResult = computePersonalAnalytics(
      mockExpenses,
      mockCategories,
      "last_month",
      refDate,
    );
    expect(lastMonthResult.totalInflow).toBe(0);
    expect(lastMonthResult.totalOutflow).toBe(1500);
    expect(lastMonthResult.categoryBreakdown[0].category.id).toBe("health");

    // All Time Test
    const allResult = computePersonalAnalytics(
      mockExpenses,
      mockCategories,
      "all",
      refDate,
    );
    expect(allResult.totalOutflow).toBe(5500); // 4000 + 1500
  });
});
