import { useCallback, useMemo, useState } from 'react';
import { Share } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  addExpense as addExpenseDb,
  addMember as addMemberDb,
  removeMember as removeMemberDb,
  setPrimaryMember as setPrimaryMemberDb,
} from '@/services/database';
import { showSuccessToast } from '@/services/toast/toast.service';
import { addExpense } from '@/store/expenseSlice';
import { addMember, removeMember, setPrimaryMemberId } from '@/store/memberSlice';
import { RootState } from '@/store/store';
import { Expense, Member } from '@/types';
import {
  computeBalances,
  computePairwiseBalances,
  generateBalanceSummaryText,
  MemberBalanceDetail,
} from '@/utils';

export function useMembersScreen() {
  const dispatch = useDispatch();
  const members = useSelector((s: RootState) => s.members.members);
  const expenses = useSelector((s: RootState) => s.expenses.expenses);

  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [primaryMemberToDelete, setPrimaryMemberToDelete] =
    useState<Member | null>(null);
  const [unsettledMemberWarning, setUnsettledMemberWarning] = useState<{
    member: Member;
    balance: number;
  } | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Settlement modal states
  const [settleModalVisible, setSettleModalVisible] = useState(false);
  const [settleTarget, setSettleTarget] = useState<{
    payer?: Member;
    receiver?: Member;
    amount?: number;
  } | null>(null);
  const [savingSettlement, setSavingSettlement] = useState(false);

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

  const handleRequestDelete = useCallback(
    (member: Member) => {
      const net = balances[member.id] ?? 0;
      if (Math.abs(net) > 0.005) {
        setUnsettledMemberWarning({ member, balance: net });
        return;
      }

      if (member.isPrimary) {
        setPrimaryMemberToDelete(member);
        return;
      }

      setMemberToDelete(member);
    },
    [balances],
  );

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

  const handleReplacePrimaryAndRemove = useCallback(
    async (choice: { selectedMemberId?: string; newMemberName?: string }) => {
      if (!primaryMemberToDelete) return;

      setDeleting(true);
      try {
        let newPrimaryName = '';

        if (choice.selectedMemberId) {
          const selected = members.find(m => m.id === choice.selectedMemberId);
          newPrimaryName = selected?.name ?? 'Selected member';
          await setPrimaryMemberDb(choice.selectedMemberId);
          dispatch(setPrimaryMemberId(choice.selectedMemberId));
        } else if (choice.newMemberName) {
          newPrimaryName = choice.newMemberName.trim();
          const newId = Date.now().toString();
          const newMember: Member = {
            id: newId,
            name: newPrimaryName,
            isPrimary: true,
          };
          await addMemberDb(newMember);
          await setPrimaryMemberDb(newId);
          dispatch(addMember(newMember));
          dispatch(setPrimaryMemberId(newId));
        }

        await removeMemberDb(primaryMemberToDelete.id);
        dispatch(removeMember(primaryMemberToDelete.id));

        showSuccessToast(
          `Removed ${primaryMemberToDelete.name}. ${newPrimaryName} is now set as You.`,
        );
        setPrimaryMemberToDelete(null);
      } finally {
        setDeleting(false);
      }
    },
    [primaryMemberToDelete, members, dispatch],
  );

  const handleSetPrimary = useCallback(async (memberId: string) => {
    try {
      await setPrimaryMemberDb(memberId);
      dispatch(setPrimaryMemberId(memberId));
      showSuccessToast('Primary profile set as "You"');
    } catch (err) {
      console.error('[Members] Failed to set primary member:', err);
    }
  }, [dispatch]);

  const handleOpenSettleUp = useCallback(
    (payer?: Member, receiver?: Member, amount?: number) => {
      setSettleTarget({ payer, receiver, amount });
      setSettleModalVisible(true);
    },
    [],
  );

  const handleCloseSettleUp = useCallback(() => {
    setSettleModalVisible(false);
    setSettleTarget(null);
  }, []);

  const handleRecordSettlement = useCallback(
    async (data: {
      payerId: string;
      receiverId: string;
      amount: number;
      date: Date;
      note?: string;
    }) => {
      setSavingSettlement(true);
      try {
        const payer = members.find(m => m.id === data.payerId);
        const receiver = members.find(m => m.id === data.receiverId);
        const payerName = payer?.name ?? 'Member';
        const receiverName = receiver?.name ?? 'Member';

        const settlementExpense: Expense = {
          id: Date.now().toString(),
          title: `${payerName} paid ${receiverName}`,
          totalAmount: data.amount,
          splitMode: 'settlement',
          categoryId: 'settlement',
          payers: [{ memberId: data.payerId, amount: data.amount }],
          participants: [{ memberId: data.receiverId, share: data.amount }],
          createdAt: data.date.getTime(),
          updatedAt: Date.now(),
        };

        await addExpenseDb(settlementExpense);
        dispatch(addExpense(settlementExpense));

        showSuccessToast(
          `Settlement recorded: ${payerName} paid ₹${data.amount.toFixed(2)} to ${receiverName}`,
        );
        setSettleModalVisible(false);
        setSettleTarget(null);
      } finally {
        setSavingSettlement(false);
      }
    },
    [members, dispatch],
  );

  const handleShareSummary = useCallback(async () => {
    try {
      const summaryText = generateBalanceSummaryText(members, expenses);
      await Share.share({
        message: summaryText,
        title: 'EquiSplit Group Balances',
      });
    } catch {
      // User cancelled or dismissed share dialog
    }
  }, [members, expenses]);

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
    primaryMemberToDelete,
    setPrimaryMemberToDelete,
    unsettledMemberWarning,
    setUnsettledMemberWarning,
    deleting,
    settleModalVisible,
    settleTarget,
    savingSettlement,
    handleAddMember,
    handleRequestDelete,
    handleConfirmDelete,
    handleReplacePrimaryAndRemove,
    handleSetPrimary,
    handleOpenSettleUp,
    handleCloseSettleUp,
    handleRecordSettlement,
    handleShareSummary,
  };
}
