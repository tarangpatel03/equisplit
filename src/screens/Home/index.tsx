import React, { FC, useCallback, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutGrid } from 'lucide-react-native';

import { assets } from '@/assets';
import { AppConfirmDialog, CategoryManagerModal } from '@/components/common';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { NavType } from '@/navigation/navigation.service';
import { RootRoutes } from '@/navigation/routes';
import { deleteExpense as deleteExpenseDb } from '@/services/database';
import { showSuccessToast } from '@/services/toast/toast.service';
import { deleteExpense } from '@/store/expenseSlice';
import { RootState } from '@/store/store';
import { colors } from '@/theme';
import { Expense, PersonalExpense } from '@/types';

import { HomeSpeedDialFab } from './components/HomeSpeedDialFab';
import { DashboardSearchBar } from './components/DashboardSearchBar';
import { DashboardTypeTabs } from './components/DashboardTypeTabs';
import { ExpenseCard } from './components/ExpenseCard';
import { PersonalExpenseCard } from './components/PersonalExpenseCard';
import { PersonalGroupExpenseCard } from './components/PersonalGroupExpenseCard';
import { PersonalOverviewCard } from './components/PersonalOverviewCard';
import { useHomeScreen } from './hooks/useHomeScreen';
import { styles } from './styles';

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
      payerLabel: string;
    };

export const HomeScreen: FC = () => {
  const navigation = useNavigation<NavType>();
  const dispatch = useDispatch();
  const categories = useSelector((s: RootState) => s.categories.categories);

  const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal');
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [personalExpenseToDelete, setPersonalExpenseToDelete] =
    useState<PersonalExpense | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [categoryManagerVisible, setCategoryManagerVisible] = useState(false);

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

    // 2. Group expenses where primary member has an active share
    if (primaryMember) {
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
            payerLabel,
          });
        }
      }
    }

    // Sort descending by date
    items.sort((a, b) => b.date - a.date);
    return items;
  }, [personalExpenses, expenses, primaryMember, members]);

  const filteredPersonalFeedItems = useMemo<PersonalFeedItem[]>(() => {
    let list = personalFeedItems;
    if (selectedCategoryId) {
      list = list.filter(item => {
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
        return titleMatch || noteMatch || payerMatch;
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

  const renderEmptyState = (
    type: 'personal' | 'group',
  ): React.JSX.Element | undefined => {
    if (loadState === 'loading') return undefined;

    if (isFiltered) {
      return (
        <View style={styles.emptyState}>
          <Image
            style={styles.emptyIcon}
            source={assets.icons.ic_search}
            resizeMode="contain"
          />
          <AppText style={styles.emptyTitle}>
            {'No matching transactions'}
          </AppText>
          <AppText style={styles.emptySubtitle}>
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
        <AppText style={styles.emptyTitle}>
          {type === 'personal'
            ? 'No personal transactions yet'
            : 'No group expenses yet'}
        </AppText>
        <AppText style={styles.emptySubtitle}>
          {type === 'personal'
            ? 'Tap + to add an expense or income.'
            : 'Tap + to add a split expense.'}
        </AppText>
      </View>
    );
  };

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

      {/* Sub-header with count badge and Category Manager Action */}
      <View style={styles.listHeader}>
        <View style={styles.headerTitleRow}>
          <AppText style={styles.sectionLabel}>
            {isPersonal ? 'Personal Records' : 'Group Splits'}
          </AppText>
          <View style={styles.expensesCountBadge}>
            <AppText style={styles.expensesCountText}>
              {isPersonal
                ? filteredPersonalFeedItems.length
                : filteredGroupExpenses.length}
            </AppText>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.manageCategoriesBtn,
            pressed && styles.manageCategoriesBtnPressed,
          ]}
          onPress={() => setCategoryManagerVisible(true)}
          hitSlop={8}
          accessibilityLabel="Manage Categories"
        >
          <LayoutGrid
            size={15}
            color={colors.textOnPrimary}
            strokeWidth={2.4}
          />
          <AppText style={styles.manageCategoriesText}>{'Categories'}</AppText>
          {categories.length > 0 && (
            <View style={styles.categoriesCountBadge}>
              <AppText style={styles.categoriesCountText}>
                {categories.length}
              </AppText>
            </View>
          )}
        </Pressable>
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
          ListHeaderComponent={
            !isFiltered ? (
              <PersonalOverviewCard
                personalExpenses={personalExpenses}
                expenses={expenses}
                members={members}
              />
            ) : undefined
          }
          renderItem={({ item }) => {
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
            return (
              <PersonalGroupExpenseCard
                expense={item.data}
                userShare={item.userShare}
                payerLabel={item.payerLabel}
                onPress={() =>
                  navigation.navigate(RootRoutes.SplitDetails, {
                    expenseId: item.data.id,
                  })
                }
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState('personal')}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList<Expense>
          style={styles.list}
          data={filteredGroupExpenses}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
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
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState('group')}
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

      {/* Global Category Manager Modal */}
      <CategoryManagerModal
        visible={categoryManagerVisible}
        onClose={() => setCategoryManagerVisible(false)}
      />
    </AppScreen>
  );
};
