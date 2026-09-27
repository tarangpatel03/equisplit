import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { getCategoryById, OTHERS_CATEGORY_ID } from '@/config';
import { RootState } from '@/store/store';
import { ExpenseCategory } from '@/types';

export type CategorySpending = {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
};

export const useAnalytics = () => {
  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const members = useSelector((state: RootState) => state.members.members);
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );

  const [selectedMemberId, setSelectedMemberId] = useState<string>('group');

  const selectedMemberName = useMemo(() => {
    if (selectedMemberId === 'group') return 'Group View';
    return members.find(m => m.id === selectedMemberId)?.name ?? 'Member';
  }, [members, selectedMemberId]);

  const { totalPaid, totalShare, categoryBreakdown, totalSpending } =
    useMemo(() => {
      let paid = 0;
      let share = 0;
      const catMap: Record<string, number> = {};

      if (selectedMemberId === 'group') {
        expenses.forEach(exp => {
          paid += exp.totalAmount;
          share += exp.totalAmount;
          const catId = exp.categoryId || OTHERS_CATEGORY_ID;
          catMap[catId] = (catMap[catId] || 0) + exp.totalAmount;
        });
      } else {
        expenses.forEach(exp => {
          // Calculate amount paid by selected member
          if (exp.payers && exp.payers.length > 0) {
            const payerContrib = exp.payers.find(
              p => p.memberId === selectedMemberId,
            );
            if (payerContrib) {
              paid += payerContrib.amount;
            }
          }

          // Calculate share owed/consumed by selected member
          if (exp.participants && exp.participants.length > 0) {
            const participant = exp.participants.find(
              p => p.memberId === selectedMemberId,
            );
            if (participant && participant.share > 0) {
              share += participant.share;
              const catId = exp.categoryId || OTHERS_CATEGORY_ID;
              catMap[catId] = (catMap[catId] || 0) + participant.share;
            }
          }
        });
      }

      const spending = selectedMemberId === 'group' ? paid : share;

      const breakdown: CategorySpending[] = Object.entries(catMap)
        .filter(([_, amt]) => amt > 0)
        .map(([catId, amt]) => {
          const category = getCategoryById(catId, categories);
          const percentage = spending > 0 ? (amt / spending) * 100 : 0;
          return {
            category,
            amount: amt,
            percentage,
          };
        })
        .sort((a, b) => b.amount - a.amount);

      return {
        totalPaid: paid,
        totalShare: share,
        totalSpending: spending,
        categoryBreakdown: breakdown,
      };
    }, [expenses, categories, selectedMemberId]);

  return {
    members,
    selectedMemberId,
    setSelectedMemberId,
    selectedMemberName,
    totalPaid,
    totalShare,
    totalSpending,
    categoryBreakdown,
    hasExpenses: expenses.length > 0,
  };
};
