import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  addMember as addMemberDb,
  deletePersonalExpense as deletePersonalExpenseDb,
  getCategories,
  getExpenses,
  getMembers,
  getPersonalExpenses,
  removeMember as removeMemberDb,
} from '@/services/database';
import { showSuccessToast } from '@/services/toast/toast.service';
import { setCategories } from '@/store/categorySlice';
import { setExpenses } from '@/store/expenseSlice';
import {
  addMember,
  removeMember,
  setMembers,
} from '@/store/memberSlice';
import {
  deletePersonalExpense,
  setPersonalExpenses,
} from '@/store/personalExpenseSlice';
import { RootState } from '@/store/store';
import { Member } from '@/types';
import { BalanceMap, computeBalances } from '@/utils';

type LoadState = 'idle' | 'loading' | 'error';

export function useHomeScreen() {
  const dispatch = useDispatch();
  const members = useSelector((s: RootState) => s.members.members);
  const expenses = useSelector((s: RootState) => s.expenses.expenses);
  const personalExpenses = useSelector(
    (s: RootState) => s.personalExpenses.personalExpenses,
  );

  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [membersModalVisible, setMembersModalVisible] = useState(false);

  // ---------------------------------------------------------------------------
  // Load from DB on mount
  // ---------------------------------------------------------------------------
  const loadData = useCallback(async () => {
    setLoadState('loading');
    try {
      const [dbMembers, dbExpenses, dbCategories, dbPersonalExpenses] =
        await Promise.all([
          getMembers(),
          getExpenses(),
          getCategories(),
          getPersonalExpenses(),
        ]);
      dispatch(setMembers(dbMembers));
      dispatch(setExpenses(dbExpenses));
      dispatch(setCategories(dbCategories));
      dispatch(setPersonalExpenses(dbPersonalExpenses));
      setLoadState('idle');
    } catch {
      setLoadState('error');
    }
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ---------------------------------------------------------------------------
  // Member management
  // ---------------------------------------------------------------------------
  const handleAddMember = useCallback(
    async (name: string) => {
      const id = Date.now().toString();
      const member: Member = { id, name: name.trim() };
      await addMemberDb(member);
      dispatch(addMember(member));
    },
    [dispatch],
  );

  const handleRemoveMember = useCallback(
    async (id: string) => {
      await removeMemberDb(id);
      dispatch(removeMember(id));
    },
    [dispatch],
  );

  // ---------------------------------------------------------------------------
  // Personal expense management
  // ---------------------------------------------------------------------------
  const handleDeletePersonalExpense = useCallback(
    async (id: string) => {
      await deletePersonalExpenseDb(id);
      dispatch(deletePersonalExpense(id));
      showSuccessToast('Personal expense deleted');
    },
    [dispatch],
  );

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------
  const balances: BalanceMap = computeBalances(members, expenses);

  return {
    members,
    expenses,
    personalExpenses,
    balances,
    loadState,
    membersModalVisible,
    setMembersModalVisible,
    handleAddMember,
    handleRemoveMember,
    handleDeletePersonalExpense,
    retry: loadData,
  };
}
