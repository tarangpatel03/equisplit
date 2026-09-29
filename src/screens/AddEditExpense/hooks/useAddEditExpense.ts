import { useCallback, useMemo, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import { DEFAULT_CATEGORY_ID } from '@/config';
import { useCurrency } from '@/hooks';
import { RootRoutes } from '@/navigation/routes';
import {
  addExpense as addExpenseDb,
  updateExpense as updateExpenseDb,
} from '@/services/database';
import {
  showErrorToast,
  showSuccessToast,
} from '@/services/toast/toast.service';
import { addExpense, updateExpense } from '@/store/expenseSlice';
import { RootState } from '@/store/store';
import {
  Expense,
  ExpenseCategory,
  ExpenseItem,
  ParticipantShare,
  PayerContribution,
  SplitMode,
} from '@/types';
import { RootRouteParams } from '@/types/navigation.types';

type NavigationProp = NativeStackNavigationProp<RootRouteParams>;
type ScreenRouteProp = RouteProp<
  RootRouteParams,
  typeof RootRoutes.AddEditExpense
>;

function finalizeShares(
  shares: { memberId: string; share: number; rawValue?: number }[],
  total: number,
): ParticipantShare[] {
  if (shares.length === 0) return [];
  const rounded = shares.map(s => ({
    memberId: s.memberId,
    share: Math.round(s.share * 100) / 100,
    rawValue: s.rawValue,
  }));
  const sumRounded = rounded.reduce((acc, s) => acc + s.share, 0);
  const diff = Math.round((total - sumRounded) * 100) / 100;
  if (diff !== 0 && rounded.length > 0) {
    rounded[0].share = Math.round((rounded[0].share + diff) * 100) / 100;
  }
  return rounded;
}

export const useAddEditExpense = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const dispatch = useDispatch();
  const { currencySymbol } = useCurrency();

  const expenseId = route.params?.expenseId;

  const members = useSelector((state: RootState) => state.members.members);
  const expenses = useSelector((state: RootState) => state.expenses.expenses);

  const existingExpense = useMemo(
    () => (expenseId ? expenses.find(e => e.id === expenseId) : undefined),
    [expenseId, expenses],
  );

  const isEdit = Boolean(existingExpense);

  // Form states
  const [title, setTitle] = useState(existingExpense?.title ?? '');
  const [totalAmountStr, setTotalAmountStr] = useState(
    existingExpense ? existingExpense.totalAmount.toString() : '',
  );
  const [splitMode, setSplitMode] = useState<SplitMode>(
    existingExpense?.splitMode ?? 'equally',
  );
  const [categoryId, setCategoryId] = useState<string>(
    existingExpense?.categoryId ?? DEFAULT_CATEGORY_ID,
  );
  const [isCategoryManuallySet, setIsCategoryManuallySet] = useState(
    Boolean(existingExpense?.categoryId),
  );

  // Date state
  const [date, setDate] = useState<Date>(() =>
    existingExpense?.createdAt
      ? new Date(existingExpense.createdAt)
      : new Date(),
  );
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const handleDateConfirm = useCallback((selectedDate: Date) => {
    setDate(selectedDate);
    setIsDatePickerVisible(false);
  }, []);

  // Track if a single payer is active to keep amount synced
  const [selectedSinglePayerId, setSelectedSinglePayerId] = useState<string | null>(
    () => {
      if (existingExpense?.payers && existingExpense.payers.length === 1) {
        return existingExpense.payers[0].memberId;
      }
      if (!existingExpense) {
        const primary = members.find(m => m.isPrimary) ?? members[0];
        return primary?.id ?? null;
      }
      return null;
    },
  );

  // Payers state: map memberId -> string amount
  const [payerContributions, setPayerContributions] = useState<
    Record<string, string>
  >(() => {
    if (existingExpense?.payers) {
      const map: Record<string, string> = {};
      existingExpense.payers.forEach(p => {
        map[p.memberId] = p.amount.toString();
      });
      return map;
    }
    const primary = members.find(m => m.isPrimary) ?? members[0];
    if (primary) {
      return { [primary.id]: '' };
    }
    return {};
  });

  // Split mode 1: Equally
  const [equalParticipantIds, setEqualParticipantIds] = useState<string[]>(
    () => {
      if (existingExpense?.participants) {
        return existingExpense.participants.map(p => p.memberId);
      }
      return members.map(m => m.id);
    },
  );

  // Split mode 2: Shares
  const [memberShares, setMemberShares] = useState<Record<string, string>>(
    () => {
      if (existingExpense && existingExpense.splitMode === 'shares') {
        const map: Record<string, string> = {};
        existingExpense.participants.forEach(p => {
          map[p.memberId] = (p.rawValue ?? 1).toString();
        });
        return map;
      }
      const defaultMap: Record<string, string> = {};
      members.forEach(m => {
        defaultMap[m.id] = '1';
      });
      return defaultMap;
    },
  );

  // Split mode 3: Exact Amounts
  const [memberAmounts, setMemberAmounts] = useState<Record<string, string>>(
    () => {
      if (existingExpense && existingExpense.splitMode === 'amount') {
        const map: Record<string, string> = {};
        existingExpense.participants.forEach(p => {
          map[p.memberId] = (p.rawValue ?? p.share).toString();
        });
        return map;
      }
      const defaultMap: Record<string, string> = {};
      members.forEach(m => {
        defaultMap[m.id] = '';
      });
      return defaultMap;
    },
  );

  // Split mode 4: Per Item
  const [items, setItems] = useState<ExpenseItem[]>(() => {
    if (existingExpense?.items && existingExpense.items.length > 0) {
      return existingExpense.items;
    }
    return [{ name: '', cost: 0, assignedTo: members.map(m => m.id) }];
  });

  const [saving, setSaving] = useState(false);
  const [titleError, setTitleError] = useState<string | undefined>();
  const [amountError, setAmountError] = useState<string | undefined>();

  const parsedTotalAmount = parseFloat(totalAmountStr) || 0;

  // Handlers
  const handleTitleChange = useCallback(
    (text: string) => {
      setTitle(text);
      setTitleError(undefined);

      // Auto-suggest category based on title keyword if user hasn't explicitly selected one
      if (!isCategoryManuallySet && !isEdit) {
        const lower = text.toLowerCase();
        if (
          /food|dinner|lunch|breakfast|burger|pizza|cafe|coffee|tea|restaurant|meal|snack|drink|beer/i.test(
            lower,
          )
        ) {
          setCategoryId('food');
        } else if (
          /grocer|milk|fruit|veg|supermarket|mart|vegetable|bread|egg/i.test(
            lower,
          )
        ) {
          setCategoryId('groceries');
        } else if (
          /uber|ola|taxi|cab|flight|fuel|petrol|diesel|bus|train|metro|fare|auto|toll/i.test(
            lower,
          )
        ) {
          setCategoryId('transport');
        } else if (
          /movie|cinema|party|club|netflix|concert|game|gaming|show|ticket/i.test(
            lower,
          )
        ) {
          setCategoryId('entertainment');
        } else if (
          /clothes|dress|shopping|amazon|flipkart|shoes|mall|shirt/i.test(lower)
        ) {
          setCategoryId('shopping');
        } else if (
          /bill|electric|wifi|water|gas|internet|recharge|power/i.test(lower)
        ) {
          setCategoryId('utilities');
        } else if (
          /rent|flat|room|apartment|maintenance|deposit|maid|cook/i.test(lower)
        ) {
          setCategoryId('housing');
        }
      }
    },
    [isCategoryManuallySet, isEdit],
  );

  const handleSelectCategory = useCallback((cat: ExpenseCategory) => {
    setCategoryId(cat.id);
    setIsCategoryManuallySet(true);
  }, []);

  const handleTotalAmountChange = useCallback(
    (text: string) => {
      setTotalAmountStr(text);
      setAmountError(undefined);

      // If single payer is active, automatically keep their contribution synced
      if (selectedSinglePayerId) {
        setPayerContributions({ [selectedSinglePayerId]: text });
      } else {
        const nonZeroPayers = Object.entries(payerContributions).filter(
          ([_, v]) => v.trim() !== '',
        );
        if (nonZeroPayers.length === 1) {
          const singleId = nonZeroPayers[0][0];
          setSelectedSinglePayerId(singleId);
          setPayerContributions({ [singleId]: text });
        }
      }
    },
    [selectedSinglePayerId, payerContributions],
  );

  const handleSelectSinglePayer = useCallback(
    (memberId: string) => {
      setSelectedSinglePayerId(memberId);
      setPayerContributions({ [memberId]: totalAmountStr });
    },
    [totalAmountStr],
  );

  const handlePayerAmountChange = useCallback(
    (memberId: string, val: string) => {
      setSelectedSinglePayerId(null);
      setPayerContributions(prev => ({ ...prev, [memberId]: val }));
    },
    [],
  );

  const handleSelectMode = useCallback(
    (mode: SplitMode) => {
      setSplitMode(mode);
      if (mode === 'perItem') {
        const itemsSum = items.reduce(
          (sum, it) => sum + (Number(it.cost) || 0),
          0,
        );
        if (itemsSum > 0) {
          setTotalAmountStr(itemsSum.toString());
        }
      }
    },
    [items],
  );

  // Equally handlers
  const handleToggleEqualMember = useCallback((memberId: string) => {
    setEqualParticipantIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId],
    );
  }, []);

  const handleSelectAllEqual = useCallback(() => {
    setEqualParticipantIds(members.map(m => m.id));
  }, [members]);

  const handleDeselectAllEqual = useCallback(() => {
    setEqualParticipantIds([]);
  }, []);

  // Shares handlers
  const handleShareChange = useCallback((memberId: string, shares: string) => {
    const cleaned = shares.replace(/[^0-9]/g, '');
    if (!cleaned) {
      setMemberShares(prev => ({ ...prev, [memberId]: '0' }));
      return;
    }
    const num = parseInt(cleaned, 10);
    setMemberShares(prev => ({ ...prev, [memberId]: num.toString() }));
  }, []);

  const handleStepperChange = useCallback((memberId: string, delta: number) => {
    setMemberShares(prev => {
      const current = parseInt(prev[memberId] ?? '0', 10) || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [memberId]: next.toString() };
    });
  }, []);

  // Exact amount handlers
  const handleMemberAmountChange = useCallback(
    (memberId: string, val: string) => {
      setMemberAmounts(prev => ({ ...prev, [memberId]: val }));
    },
    [],
  );

  // Per Item handlers
  const handleAddItem = useCallback(() => {
    setItems(prev => [
      ...prev,
      { name: '', cost: 0, assignedTo: members.map(m => m.id) },
    ]);
  }, [members]);

  const handleDeleteItem = useCallback((idx: number) => {
    setItems(prev => {
      const next = prev.filter((_, i) => i !== idx);
      const itemsSum = next.reduce(
        (sum, it) => sum + (Number(it.cost) || 0),
        0,
      );
      setTotalAmountStr(itemsSum.toString());
      return next;
    });
  }, []);

  const handleItemNameChange = useCallback((idx: number, name: string) => {
    setItems(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], name };
      return next;
    });
  }, []);

  const handleItemCostChange = useCallback((idx: number, costStr: string) => {
    const cost = parseFloat(costStr) || 0;
    setItems(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], cost };
      const itemsSum = next.reduce(
        (sum, it) => sum + (Number(it.cost) || 0),
        0,
      );
      setTotalAmountStr(itemsSum.toString());
      return next;
    });
  }, []);

  const handleToggleItemMember = useCallback(
    (idx: number, memberId: string) => {
      setItems(prev => {
        const next = [...prev];
        const assigned = next[idx].assignedTo;
        next[idx] = {
          ...next[idx],
          assignedTo: assigned.includes(memberId)
            ? assigned.filter(id => id !== memberId)
            : [...assigned, memberId],
        };
        return next;
      });
    },
    [],
  );

  // Validation & Save
  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      showErrorToast('Please enter an expense title');
      return;
    }

    const total = parseFloat(totalAmountStr);
    if (isNaN(total) || total <= 0) {
      setAmountError('Enter a valid amount');
      showErrorToast('Please enter a valid total amount');
      return;
    }

    // Validate Payers
    const payers: PayerContribution[] = [];
    let sumPaid = 0;
    for (const m of members) {
      const amt = parseFloat(payerContributions[m.id] ?? '0');
      if (!isNaN(amt) && amt > 0) {
        payers.push({ memberId: m.id, amount: Math.round(amt * 100) / 100 });
        sumPaid += amt;
      }
    }

    if (payers.length === 0) {
      showErrorToast('Please specify who paid for this expense');
      return;
    }

    if (Math.abs(sumPaid - total) > 0.05) {
      showErrorToast(
        `Total paid (${currencySymbol}${sumPaid.toFixed(
          2,
        )}) must equal total amount (${currencySymbol}${total.toFixed(2)})`,
      );
      return;
    }

    // Validate and compute Participants
    let participants: ParticipantShare[] = [];

    if (splitMode === 'equally') {
      if (equalParticipantIds.length === 0) {
        showErrorToast('Select at least one participant');
        return;
      }
      const rawShare = total / equalParticipantIds.length;
      const initialShares = equalParticipantIds.map(id => ({
        memberId: id,
        share: rawShare,
      }));
      participants = finalizeShares(initialShares, total);
    } else if (splitMode === 'shares') {
      const totalShares = members.reduce((sum, m) => {
        const val = parseFloat(memberShares[m.id] ?? '0');
        return sum + (isNaN(val) || val < 0 ? 0 : val);
      }, 0);

      if (totalShares <= 0) {
        showErrorToast('At least one member must have shares greater than 0');
        return;
      }

      const activeShares: {
        memberId: string;
        share: number;
        rawValue: number;
      }[] = [];
      members.forEach(m => {
        const s = parseFloat(memberShares[m.id] ?? '0') || 0;
        if (s > 0) {
          activeShares.push({
            memberId: m.id,
            share: (s / totalShares) * total,
            rawValue: s,
          });
        }
      });
      participants = finalizeShares(activeShares, total);
    } else if (splitMode === 'amount') {
      let sumAllocated = 0;
      const activeAmounts: {
        memberId: string;
        share: number;
        rawValue: number;
      }[] = [];
      members.forEach(m => {
        const amt = parseFloat(memberAmounts[m.id] ?? '0') || 0;
        if (amt > 0) {
          activeAmounts.push({
            memberId: m.id,
            share: amt,
            rawValue: amt,
          });
          sumAllocated += amt;
        }
      });

      if (Math.abs(sumAllocated - total) > 0.05) {
        showErrorToast(
          `Allocated amount (${currencySymbol}${sumAllocated.toFixed(
            2,
          )}) must equal total amount (${currencySymbol}${total.toFixed(2)})`,
        );
        return;
      }
      participants = finalizeShares(activeAmounts, total);
    } else if (splitMode === 'perItem') {
      if (items.length === 0) {
        showErrorToast('Please add at least one item');
        return;
      }

      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (it.cost <= 0) {
          showErrorToast(
            `Please enter a valid cost for "${it.name || `Item #${i + 1}`}"`,
          );
          return;
        }
        if (it.assignedTo.length === 0) {
          showErrorToast(
            `Please assign at least one person to "${
              it.name || `Item #${i + 1}`
            }"`,
          );
          return;
        }
      }

      const memberMap: Record<string, number> = {};
      items.forEach(it => {
        const itemShare = it.cost / it.assignedTo.length;
        it.assignedTo.forEach(mId => {
          memberMap[mId] = (memberMap[mId] || 0) + itemShare;
        });
      });

      const initialShares = Object.entries(memberMap).map(
        ([memberId, share]) => ({
          memberId,
          share,
        }),
      );
      participants = finalizeShares(initialShares, total);
    }

    setSaving(true);
    try {
      const expenseData: Expense = {
        id: existingExpense ? existingExpense.id : Date.now().toString(),
        title: title.trim(),
        totalAmount: total,
        splitMode,
        categoryId,
        payers,
        participants,
        items: splitMode === 'perItem' ? items : undefined,
        createdAt: date.getTime(),
        updatedAt: Date.now(),
      };

      if (isEdit) {
        await updateExpenseDb(expenseData);
        dispatch(updateExpense(expenseData));
        showSuccessToast('Expense updated successfully');
      } else {
        await addExpenseDb(expenseData);
        dispatch(addExpense(expenseData));
        showSuccessToast('Expense added successfully');
      }

      navigation.goBack();
    } catch {
      showErrorToast('Failed to save expense');
    } finally {
      setSaving(false);
    }
  }, [
    title,
    totalAmountStr,
    categoryId,
    members,
    payerContributions,
    splitMode,
    equalParticipantIds,
    memberShares,
    memberAmounts,
    items,
    existingExpense,
    isEdit,
    date,
    dispatch,
    navigation,
  ]);

  return {
    members,
    isEdit,
    title,
    titleError,
    totalAmountStr,
    amountError,
    parsedTotalAmount,
    splitMode,
    categoryId,
    payerContributions,
    equalParticipantIds,
    memberShares,
    memberAmounts,
    items,
    saving,
    handleTitleChange,
    handleSelectCategory,
    handleTotalAmountChange,
    handleSelectSinglePayer,
    handlePayerAmountChange,
    handleSelectMode,
    handleToggleEqualMember,
    handleSelectAllEqual,
    handleDeselectAllEqual,
    handleShareChange,
    handleStepperChange,
    handleMemberAmountChange,
    handleAddItem,
    handleDeleteItem,
    handleItemNameChange,
    handleItemCostChange,
    handleToggleItemMember,
    handleSave,
    date,
    isDatePickerVisible,
    setIsDatePickerVisible,
    handleDateConfirm,
  };
};
