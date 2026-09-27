import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  addMember as addMemberDb,
  getCategories,
  getExpenses,
  getMembers,
  removeMember as removeMemberDb,
} from '@/services/database';
import { setCategories } from '@/store/categorySlice';
import {
  addMember,
  removeMember,
  setMembers,
} from '@/store/memberSlice';
import { setExpenses } from '@/store/expenseSlice';
import { RootState } from '@/store/store';
import { computeBalances, BalanceMap } from '@/utils';
import { Member } from '@/types';

type LoadState = 'idle' | 'loading' | 'error';

export function useHomeScreen() {
  const dispatch = useDispatch();
  const members = useSelector((s: RootState) => s.members.members);
  const expenses = useSelector((s: RootState) => s.expenses.expenses);

  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [membersModalVisible, setMembersModalVisible] = useState(false);

  // ---------------------------------------------------------------------------
  // Load from DB on mount
  // ---------------------------------------------------------------------------
  const loadData = useCallback(async () => {
    setLoadState('loading');
    try {
      const [dbMembers, dbExpenses, dbCategories] = await Promise.all([
        getMembers(),
        getExpenses(),
        getCategories(),
      ]);
      dispatch(setMembers(dbMembers));
      dispatch(setExpenses(dbExpenses));
      dispatch(setCategories(dbCategories));
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
  // Derived state
  // ---------------------------------------------------------------------------
  const balances: BalanceMap = computeBalances(members, expenses);

  return {
    members,
    expenses,
    balances,
    loadState,
    membersModalVisible,
    setMembersModalVisible,
    handleAddMember,
    handleRemoveMember,
    retry: loadData,
  };
}
