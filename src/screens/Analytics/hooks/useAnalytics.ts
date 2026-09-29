import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { getCategoryById, OTHERS_CATEGORY_ID } from "@/config";
import { RootState } from "@/store/store";
import { ExpenseCategory } from "@/types";
import {
  computePersonalAnalytics,
  TimePeriod,
} from "@/utils/personalAnalytics";

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
  const personalExpenses = useSelector(
    (state: RootState) => state.personalExpenses?.personalExpenses ?? [],
  );

  const trackOutOfPocket = useSelector(
    (state: RootState) => state.preferences?.trackOutOfPocket ?? false,
  );

  const primaryMember = useMemo(
    () => members.find(m => m.isPrimary),
    [members],
  );

  const effectivePersonalExpenses = useMemo(() => {
    if (!primaryMember) {
      return personalExpenses;
    }
    const combined = [...personalExpenses];

    if (trackOutOfPocket) {
      // Out-of-Pocket / Cash Flow Mode
      for (const exp of expenses) {
        if (exp.splitMode === 'settlement') {
          const receiverId = exp.participants?.[0]?.memberId;
          // Only settlement received creates an inflow (settlement income)
          if (receiverId === primaryMember.id) {
            combined.push({
              id: `settle_recv_${exp.id}`,
              title: exp.title,
              amount: exp.totalAmount,
              type: 'income',
              categoryId: 'settlement',
              date: exp.createdAt,
              createdAt: exp.createdAt,
              updatedAt: exp.updatedAt ?? exp.createdAt,
            });
          }
        } else {
          const userPayer = exp.payers?.find(
            p => p.memberId === primaryMember.id,
          );
          if (userPayer && userPayer.amount > 0) {
            // Primary user paid out of pocket (Scenarios 1 & 3)
            combined.push({
              id: `group_oop_${exp.id}`,
              title: exp.title,
              amount: userPayer.amount,
              type: 'expense',
              categoryId: exp.categoryId ?? 'others',
              date: exp.createdAt,
              createdAt: exp.createdAt,
              updatedAt: exp.updatedAt ?? exp.createdAt,
            });
          } else {
            // Another member paid: primary user's consumed share is counted (Scenarios 2 & 4)
            const participant = exp.participants?.find(
              p => p.memberId === primaryMember.id,
            );
            if (participant && participant.share > 0) {
              combined.push({
                id: `group_share_${exp.id}`,
                title: exp.title,
                amount: participant.share,
                type: 'expense',
                categoryId: exp.categoryId ?? 'others',
                date: exp.createdAt,
                createdAt: exp.createdAt,
                updatedAt: exp.updatedAt ?? exp.createdAt,
              });
            }
          }
        }
      }
    } else {
      // Consumption Mode (Default): Group expenses where primary member has an active share
      for (const exp of expenses) {
        if (exp.splitMode === 'settlement') continue;
        const participant = exp.participants?.find(
          p => p.memberId === primaryMember.id,
        );
        if (participant && participant.share > 0) {
          combined.push({
            id: `group_share_${exp.id}`,
            title: exp.title,
            amount: participant.share,
            type: 'expense',
            categoryId: exp.categoryId ?? 'others',
            date: exp.createdAt,
            createdAt: exp.createdAt,
            updatedAt: exp.updatedAt ?? exp.createdAt,
          });
        }
      }
    }
    return combined;
  }, [personalExpenses, expenses, primaryMember, trackOutOfPocket]);

  const [activeTab, setActiveTab] = useState<"personal" | "group">("personal");
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("this_month");
  const [selectedMemberId, setSelectedMemberId] = useState<string>("group");

  const personalAnalytics = useMemo(() => {
    return computePersonalAnalytics(
      effectivePersonalExpenses,
      categories,
      selectedPeriod,
    );
  }, [effectivePersonalExpenses, categories, selectedPeriod]);

  const selectedMemberName = useMemo(() => {
    if (selectedMemberId === "group") return "Group View";
    return members.find(m => m.id === selectedMemberId)?.name ?? "Member";
  }, [members, selectedMemberId]);

  const { totalPaid, totalShare, categoryBreakdown, totalSpending } =
    useMemo(() => {
      let paid = 0;
      let share = 0;
      const catMap: Record<string, number> = {};

      if (selectedMemberId === "group") {
        expenses.forEach(exp => {
          if (exp.splitMode === 'settlement') return;
          paid += exp.totalAmount;
          share += exp.totalAmount;
          const catId = exp.categoryId || OTHERS_CATEGORY_ID;
          catMap[catId] = (catMap[catId] || 0) + exp.totalAmount;
        });
      } else {
        expenses.forEach(exp => {
          if (exp.splitMode === 'settlement') return;
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

      const spending = selectedMemberId === "group" ? paid : share;

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
    activeTab,
    setActiveTab,
    selectedPeriod,
    setSelectedPeriod,
    personalAnalytics,
    personalExpensesCount: effectivePersonalExpenses.length,
    members,
    selectedMemberId,
    setSelectedMemberId,
    selectedMemberName,
    totalPaid,
    totalShare,
    totalSpending,
    categoryBreakdown,
    hasGroupExpenses: expenses.length > 0,
  };
};
