import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  addMember as addMemberDb,
  removeMember as removeMemberDb,
  setPrimaryMember as setPrimaryMemberDb,
} from '@/services/database';
import { showSuccessToast } from '@/services/toast/toast.service';
import { addMember, removeMember, setPrimaryMemberId } from '@/store/memberSlice';
import { RootState } from '@/store/store';
import { Member } from '@/types';
import {
  computeBalances,
  computePairwiseBalances,
  MemberBalanceDetail,
} from '@/utils';

export function useMembersScreen() {
  const dispatch = useDispatch();
  const members = useSelector((s: RootState) => s.members.members);
  const expenses = useSelector((s: RootState) => s.expenses.expenses);

  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Group balance summary map
  const balances = useMemo(
    () => computeBalances(members, expenses),
    [members, expenses],
  );

  // Pairwise balance breakdown per member
  const pairwiseDetails: MemberBalanceDetail[] = useMemo(
    () => computePairwiseBalances(members, expenses),
    [members, expenses],
  );

  const handleAddMember = useCallback(async () => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    setAdding(true);
    try {
      const id = Date.now().toString();
      // If this is the very first member, automatically mark them as primary
      const isPrimary = members.length === 0;
      const member: Member = { id, name: trimmed, isPrimary };
      await addMemberDb(member);
      dispatch(addMember(member));
      if (isPrimary) {
        await setPrimaryMemberDb(id);
        dispatch(setPrimaryMemberId(id));
      }
      showSuccessToast(`Added member ${trimmed}`);
      setNewName('');
    } finally {
      setAdding(false);
    }
  }, [newName, members.length, dispatch]);

  const handleConfirmDelete = useCallback(async () => {
    if (!memberToDelete) return;

    setDeleting(true);
    try {
      await removeMemberDb(memberToDelete.id);
      dispatch(removeMember(memberToDelete.id));
      showSuccessToast(`Removed ${memberToDelete.name}`);
      setMemberToDelete(null);
    } finally {
      setDeleting(false);
    }
  }, [memberToDelete, dispatch]);

  const handleSetPrimary = useCallback(async (memberId: string) => {
    try {
      await setPrimaryMemberDb(memberId);
      dispatch(setPrimaryMemberId(memberId));
      showSuccessToast('Primary profile set as "You"');
    } catch (err) {
      console.error('[Members] Failed to set primary member:', err);
    }
  }, [dispatch]);

  return {
    members,
    expenses,
    balances,
    pairwiseDetails,
    newName,
    setNewName,
    adding,
    memberToDelete,
    setMemberToDelete,
    deleting,
    handleAddMember,
    handleConfirmDelete,
    handleSetPrimary,
  };
}
