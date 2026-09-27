import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  addMember as addMemberDb,
  removeMember as removeMemberDb,
} from '@/services/database';
import { showSuccessToast } from '@/services/toast/toast.service';
import { addMember, removeMember } from '@/store/memberSlice';
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
      const member: Member = { id, name: trimmed };
      await addMemberDb(member);
      dispatch(addMember(member));
      showSuccessToast(`Added member ${trimmed}`);
      setNewName('');
    } finally {
      setAdding(false);
    }
  }, [newName, dispatch]);

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
  };
}
