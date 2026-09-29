import { PersonalExpense, Expense, Member } from '../src/types';
import { computeBalances } from '../src/utils/balance';

describe('Personal Overview & Balance Inflow/Outflow Logic', () => {
  it('correctly aggregates personal income, solo spend, and group balance', () => {
    const primaryMember: Member = { id: 'm-1', name: 'Tarang', isPrimary: true };
    const friend: Member = { id: 'm-2', name: 'Alex' };
    const members = [primaryMember, friend];

    const personalExpenses: PersonalExpense[] = [
      {
        id: 'p-1',
        title: 'Freelance Payout',
        amount: 5000,
        type: 'income',
        categoryId: 'general',
        date: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'p-2',
        title: 'Groceries',
        amount: 800,
        type: 'expense',
        categoryId: 'food',
        date: Date.now(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    // Group expense where Tarang paid 1000, split equally (500 each)
    // So Tarang is owed 500 by Alex (positive group credit)
    const groupExpenses: Expense[] = [
      {
        id: 'g-1',
        title: 'Dinner',
        totalAmount: 1000,
        splitMode: 'equally',
        payers: [{ memberId: 'm-1', amount: 1000 }],
        participants: [
          { memberId: 'm-1', share: 500 },
          { memberId: 'm-2', share: 500 },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ];

    const balances = computeBalances(members, groupExpenses);
    const tarangNet = balances['m-1'] ?? 0;
    expect(tarangNet).toBe(500);

    const personalIncome = personalExpenses
      .filter(p => p.type === 'income')
      .reduce((sum, p) => sum + p.amount, 0);
    const personalSpend = personalExpenses
      .filter(p => p.type !== 'income')
      .reduce((sum, p) => sum + p.amount, 0);

    const groupCredit = tarangNet > 0 ? tarangNet : 0;
    const groupDebt = tarangNet < 0 ? Math.abs(tarangNet) : 0;

    const totalInflow = personalIncome + groupCredit; // 5000 + 500 = 5500
    const totalOutflow = personalSpend + groupDebt;   // 800 + 0 = 800
    const finalBalance = totalInflow - totalOutflow;  // 4700

    expect(totalInflow).toBe(5500);
    expect(totalOutflow).toBe(800);
    expect(finalBalance).toBe(4700);
  });
});
