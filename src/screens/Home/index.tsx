import { useNavigation } from '@react-navigation/native';
import { FC, useCallback, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { assets } from '@/assets';
import { AppConfirmDialog } from '@/components/common';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { usePreferences } from '@/hooks';
import { RootRoutes } from '@/navigation/routes';
import { deleteExpense as deleteExpenseDb } from '@/services/database';
import { showSuccessToast } from '@/services/toast/toast.service';
import { deleteExpense } from '@/store/expenseSlice';
import { useAppTheme } from '@/theme';

import { DashboardSearchBar } from './components/DashboardSearchBar';
import { DashboardTypeTabs } from './components/DashboardTypeTabs';
import { ExpenseCard } from './components/ExpenseCard';
import { HomeSpeedDialFab } from './components/HomeSpeedDialFab';
import { PersonalExpenseCard } from './components/PersonalExpenseCard';
import { PersonalGroupExpenseCard } from './components/PersonalGroupExpenseCard';
import { PersonalOverviewCard } from './components/PersonalOverviewCard';
import { PersonalSettlementCard } from './components/PersonalSettlementCard';
import { useHomeScreen } from './hooks/useHomeScreen';
import { styles } from './styles';

import type { NavType } from '@/navigation/navigation.service';
import type { RootState } from '@/store/store';
import type { Expense, PersonalExpense } from '@/types';

type PersonalFeedItem =
  | {
      type: 'personal';
      id: string;
      date: number;
      data: PersonalExpense;
    }
  | {
      type: 'group';
      id: string;
      date: number;
      data: Expense;
      userShare: number;
      amountSubtext?: string;
      payerLabel: string;
    }
  | {
      type: 'settlement';
      id: string;
      date: number;
      data: Expense;
      direction: 'received' | 'paid';
      amount: number;
      counterpartName: string;
    };

export const HomeScreen: FC = () => {
  const { colors: themeColors } = useAppTheme();
  const navigation = useNavigation<NavType>();
  const dispatch = useDispatch();
  const categories = useSelector((s: RootState) => s.categories.categories);

  const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal');
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [personalExpenseToDelete, setPersonalExpenseToDelete] =
    useState<PersonalExpense | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const {
    members,
    expenses,
    personalExpenses,
    loadState,
    retry,
    handleDeletePersonalExpense,
  } = useHomeScreen();

  const handleConfirmDeleteGroup = useCallback(async () => {
    if (!expenseToDelete) return;
    setDeleting(true);
    try {
      await deleteExpenseDb(expenseToDelete.id);
      dispatch(deleteExpense(expenseToDelete.id));
      showSuccessToast('Group expense deleted');
      setExpenseToDelete(null);
    } finally {
      setDeleting(false);
    }
  }, [expenseToDelete, dispatch]);

  const handleConfirmDeletePersonal = useCallback(async () => {
    if (!personalExpenseToDelete) return;
    setDeleting(true);
    try {
      await handleDeletePersonalExpense(personalExpenseToDelete.id);
      setPersonalExpenseToDelete(null);
    } finally {
      setDeleting(false);
    }
  }, [personalExpenseToDelete, handleDeletePersonalExpense]);

  const { trackOutOfPocket } = usePreferences();

  const primaryMember = useMemo(
    () => members.find(m => m.isPrimary),
    [members],
  );

  const personalFeedItems = useMemo(() => {
    const items: PersonalFeedItem[] = [];

    // 1. Direct personal expenses/income
    for (const pe of personalExpenses) {
      items.push({
        type: 'personal',
        id: `personal_${pe.id}`,
        date: pe.date,
        data: pe,
      });
    }

    if (!primaryMember) {
      items.sort((a, b) => b.date - a.date);
      return items;
    }

    // 2. Group expenses & settlements based on preference mode
    if (trackOutOfPocket) {
      // Out-of-Pocket / Cash Flow Mode
      for (const exp of expenses) {
        if (exp.splitMode === 'settlement') {
          const receiverId = exp.participants?.[0]?.memberId;
          const payerId = exp.payers?.[0]?.memberId;

          if (receiverId === primaryMember.id) {
            const payerName =
              members.find(m => m.id === payerId)?.name ?? 'Member';
            items.push({
              type: 'settlement',
              id: `settlement_recv_${exp.id}`,
              date: exp.createdAt,
              data: exp,
              direction: 'received',
              amount: exp.totalAmount,
              counterpartName: payerName,
            });
          }
        } else {
          // Regular group expense
          const userPayer = exp.payers?.find(
            p => p.memberId === primaryMember.id,
          );
          if (userPayer && userPayer.amount > 0) {
            items.push({
              type: 'group',
              id: `group_oop_${exp.id}`,
              date: exp.createdAt,
              data: exp,
              userShare: userPayer.amount,
              amountSubtext: 'Paid out of pocket',
              payerLabel: 'Paid by You',
            });
          } else {
            // Another member paid: record primary user's allocated share (Scenarios 2 & 4)
            const participant = exp.participants?.find(
              p => p.memberId === primaryMember.id,
            );
            if (participant && participant.share > 0) {
              const isSolePayer = exp.payers?.length === 1;
              let payerLabel = 'Paid by Other';
              if (isSolePayer && exp.payers[0]) {
                const payerName =
                  members.find(m => m.id === exp.payers[0].memberId)?.name ??
                  'Member';
                payerLabel = `Paid by ${payerName}`;
              } else {
                payerLabel = 'Multiple Payers';
              }

              items.push({
                type: 'group',
                id: `group_share_${exp.id}`,
                date: exp.createdAt,
                data: exp,
                userShare: participant.share,
                amountSubtext: 'Your share',
                payerLabel,
              });
            }
          }
        }
      }
    } else {
      // Consumption Mode (Default): Group expenses where primary member has an active share
      for (const ge of expenses) {
        if (ge.splitMode === 'settlement') continue;
        const participant = ge.participants.find(
          p => p.memberId === primaryMember.id,
        );
        if (participant && participant.share > 0) {
          const isSolePayerPrimary =
            ge.payers.length === 1 &&
            ge.payers[0].memberId === primaryMember.id;
          let payerLabel = 'Paid by You';
          if (!isSolePayerPrimary) {
            if (ge.payers.length === 1) {
              const payerName =
                members.find(m => m.id === ge.payers[0].memberId)?.name ??
                'Member';
              payerLabel = `Paid by ${payerName}`;
            } else {
              const userPayer = ge.payers.find(
                p => p.memberId === primaryMember.id,
              );
              payerLabel = userPayer
                ? 'Multiple (incl. You)'
                : 'Multiple Payers';
            }
          }

          items.push({
            type: 'group',
            id: `group_${ge.id}`,
            date: ge.createdAt,
            data: ge,
            userShare: participant.share,
            amountSubtext: 'Your share',
            payerLabel,
          });
        }
      }
    }

    // Sort descending by date
    items.sort((a, b) => b.date - a.date);
    return items;
  }, [personalExpenses, expenses, primaryMember, members, trackOutOfPocket]);

  const filteredPersonalFeedItems = useMemo<PersonalFeedItem[]>(() => {
    let list = personalFeedItems;
    if (selectedCategoryId) {
      list = list.filter(item => {
        if (item.type === 'settlement') {
          return selectedCategoryId === 'settlement';
        }
        const catId = item.data.categoryId ?? 'others';
        return catId === selectedCategoryId;
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => {
        const titleMatch = item.data.title.toLowerCase().includes(q);
        const noteMatch =
          item.type === 'personal' && item.data.note
            ? item.data.note.toLowerCase().includes(q)
            : false;
        const payerMatch =
          item.type === 'group'
            ? item.payerLabel.toLowerCase().includes(q)
            : false;
        const settlementMatch =
          item.type === 'settlement'
            ? item.counterpartName.toLowerCase().includes(q)
            : false;
        return titleMatch || noteMatch || payerMatch || settlementMatch;
      });
    }
    return list;
  }, [personalFeedItems, selectedCategoryId, searchQuery]);

  const filteredGroupExpenses = useMemo(() => {
    let list = expenses;
    if (selectedCategoryId) {
      list = list.filter(item => item.categoryId === selectedCategoryId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => {
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchPayer = item.payers.some(p => {
          const name = members.find(m => m.id === p.memberId)?.name ?? '';
          return name.toLowerCase().includes(q);
        });
        return matchTitle || matchPayer;
      });
    }
    return list;
  }, [expenses, members, selectedCategoryId, searchQuery]);

  const isFiltered = Boolean(searchQuery.trim() || selectedCategoryId);

  const renderEmptyState = useCallback(
    (type: 'personal' | 'group'): React.JSX.Element | undefined => {
      if (loadState === 'loading') return undefined;

      if (isFiltered) {
        return (
          <View style={styles.emptyState}>
            <Image
              style={styles.emptyIcon}
              source={assets.icons.ic_search}
              resizeMode="contain"
            />
            <AppText
              style={[styles.emptyTitle, { color: themeColors.textPrimary }]}
            >
              {'No matching transactions'}
            </AppText>
            <AppText
              style={[
                styles.emptySubtitle,
                { color: themeColors.textSecondary },
              ]}
            >
              {'Try adjusting your search query or category filter.'}
            </AppText>
            <Pressable
              style={styles.clearFilterBtn}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategoryId(null);
              }}
            >
              <AppText style={styles.clearFilterBtnText}>
                {'Clear Filters'}
              </AppText>
            </Pressable>
          </View>
        );
      }

      return (
        <View style={styles.emptyState}>
          <Image
            style={styles.emptyIcon}
            source={assets.icons.ic_receipt}
            resizeMode="contain"
          />
          <AppText
            style={[styles.emptyTitle, { color: themeColors.textPrimary }]}
          >
            {type === 'personal'
              ? 'No personal transactions yet'
              : 'No group expenses yet'}
          </AppText>
          <AppText
            style={[styles.emptySubtitle, { color: themeColors.textSecondary }]}
          >
            {type === 'personal'
              ? 'Tap + to add an expense or income.'
              : 'Tap + to add a split expense.'}
          </AppText>
        </View>
      );
    },
    [
      isFiltered,
      loadState,
      setSearchQuery,
      setSelectedCategoryId,
      themeColors.textPrimary,
      themeColors.textSecondary,
    ],
  );

  const renderPersonalFeedItem = useCallback(
    ({ item }: { item: PersonalFeedItem }) => {
      if (item.type === 'personal') {
        return (
          <PersonalExpenseCard
            expense={item.data}
            onPress={() =>
              navigation.navigate(RootRoutes.AddEditPersonalExpense, {
                personalExpenseId: item.data.id,
              })
            }
            onDelete={() => setPersonalExpenseToDelete(item.data)}
          />
        );
      }
      if (item.type === 'settlement') {
        return (
          <PersonalSettlementCard
            settlement={item.data}
            direction={item.direction}
            amount={item.amount}
            counterpartName={item.counterpartName}
          />
        );
      }
      return (
        <PersonalGroupExpenseCard
          expense={item.data}
          userShare={item.userShare}
          amountSubtext={item.amountSubtext}
          payerLabel={item.payerLabel}
          onPress={() =>
            navigation.navigate(RootRoutes.SplitDetails, {
              expenseId: item.data.id,
            })
          }
        />
      );
    },
    [navigation],
  );

  const renderGroupExpenseItem = useCallback(
    ({ item }: { item: Expense }) => (
      <ExpenseCard
        expense={item}
        members={members}
        onPress={() =>
          navigation.navigate(RootRoutes.SplitDetails, {
            expenseId: item.id,
          })
        }
        onDelete={() => setExpenseToDelete(item)}
      />
    ),
    [members, navigation],
  );

  const renderPersonalHeader = useCallback(() => {
    if (isFiltered) return null;
    return (
      <PersonalOverviewCard
        personalExpenses={personalExpenses}
        expenses={expenses}
        members={members}
      />
    );
  }, [isFiltered, personalExpenses, expenses, members]);

  const renderPersonalEmpty = useCallback(
    () => renderEmptyState('personal'),
    [renderEmptyState],
  );

  const renderGroupEmpty = useCallback(
    () => renderEmptyState('group'),
    [renderEmptyState],
  );

  if (loadState === 'error') {
    return (
      <AppScreen screenTitle="EquiSplit" preset="fixed" safeAreaEdges={['top']}>
        <View style={styles.centerState}>
          <AppText style={styles.errorText}>{'Failed to load data.'}</AppText>
          <Pressable onPress={retry} style={styles.retryBtn}>
            <AppText style={styles.retryText}>{'Tap to retry'}</AppText>
          </Pressable>
        </View>
      </AppScreen>
    );
  }

  const isPersonal = activeTab === 'personal';

  return (
    <AppScreen
      screenTitle="EquiSplit"
      showBackButton={false}
      preset="fixed"
      safeAreaEdges={['top']}
    >
      {/* Top Segmented Tab Switcher */}
      <DashboardTypeTabs
        activeTab={activeTab}
        personalCount={personalFeedItems.length}
        groupCount={expenses.length}
        onSelectTab={setActiveTab}
      />

      {/* Sub-header with count badge */}
      <View style={styles.listHeader}>
        <View style={styles.headerTitleRow}>
          <AppText
            style={[styles.sectionLabel, { color: themeColors.textPrimary }]}
          >
            {isPersonal ? 'Personal Records' : 'Group Splits'}
          </AppText>
          <View
            style={[
              styles.expensesCountBadge,
              {
                backgroundColor: themeColors.surfaceAlt,
                borderColor: themeColors.border,
              },
            ]}
          >
            <AppText
              style={[
                styles.expensesCountText,
                { color: themeColors.textSecondary },
              ]}
            >
              {isPersonal
                ? filteredPersonalFeedItems.length
                : filteredGroupExpenses.length}
            </AppText>
          </View>
        </View>
      </View>

      {/* Search and Category Filter Bar */}
      <DashboardSearchBar
        searchQuery={searchQuery}
        onChangeSearch={setSearchQuery}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        categories={categories}
      />

      {/* Conditional List Rendering */}
      {isPersonal ? (
        <FlatList<PersonalFeedItem>
          style={styles.list}
          data={filteredPersonalFeedItems}
          keyExtractor={item => item.id}
          ListHeaderComponent={renderPersonalHeader}
          renderItem={renderPersonalFeedItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderPersonalEmpty}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList<Expense>
          style={styles.list}
          data={filteredGroupExpenses}
          keyExtractor={item => item.id}
          renderItem={renderGroupExpenseItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderGroupEmpty}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Speed Dial Multi-Action FAB popping Left (Personal) and Top (Group) */}
      <HomeSpeedDialFab
        onSelectPersonal={() =>
          navigation.navigate(RootRoutes.AddEditPersonalExpense)
        }
        onSelectGroup={() => navigation.navigate(RootRoutes.AddEditExpense)}
      />

      {/* Confirm Delete Group Expense Dialog */}
      <AppConfirmDialog
        visible={Boolean(expenseToDelete)}
        title="Delete Group Expense"
        message={`Are you sure you want to delete "${expenseToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={handleConfirmDeleteGroup}
        onCancel={() => setExpenseToDelete(null)}
      />

      {/* Confirm Delete Personal Expense Dialog */}
      <AppConfirmDialog
        visible={Boolean(personalExpenseToDelete)}
        title="Delete Personal Record"
        message={`Are you sure you want to delete "${personalExpenseToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={handleConfirmDeletePersonal}
        onCancel={() => setPersonalExpenseToDelete(null)}
      />
    </AppScreen>
  );
};
