import { useCallback, useState } from 'react';
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

import { AddExpenseActionModal } from './components/AddExpenseActionModal';
import { DashboardTypeTabs } from './components/DashboardTypeTabs';
import { ExpenseCard } from './components/ExpenseCard';
import { PersonalExpenseCard } from './components/PersonalExpenseCard';
import { PersonalOverviewCard } from './components/PersonalOverviewCard';
import { useHomeScreen } from './hooks/useHomeScreen';
import { styles } from './styles';

export const HomeScreen = () => {
  const navigation = useNavigation<NavType>();
  const dispatch = useDispatch();
  const categories = useSelector((s: RootState) => s.categories.categories);

  const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal');
  const [addExpenseModalVisible, setAddExpenseModalVisible] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [personalExpenseToDelete, setPersonalExpenseToDelete] =
    useState<PersonalExpense | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [categoryManagerVisible, setCategoryManagerVisible] = useState(false);

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
    <AppScreen screenTitle="EquiSplit" preset="fixed" safeAreaEdges={['top']}>
      {/* Top Segmented Tab Switcher */}
      <DashboardTypeTabs
        activeTab={activeTab}
        personalCount={personalExpenses.length}
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
              {isPersonal ? personalExpenses.length : expenses.length}
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

      {/* Conditional List Rendering */}
      {isPersonal ? (
        <FlatList
          style={styles.list}
          data={personalExpenses}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <PersonalOverviewCard
              personalExpenses={personalExpenses}
              expenses={expenses}
              members={members}
            />
          }
          renderItem={({ item }) => (
            <PersonalExpenseCard
              expense={item}
              onPress={() =>
                navigation.navigate(RootRoutes.AddEditPersonalExpense, {
                  personalExpenseId: item.id,
                })
              }
              onDelete={() => setPersonalExpenseToDelete(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            loadState === 'loading' ? undefined : (
              <View style={styles.emptyState}>
                <Image
                  style={styles.emptyIcon}
                  source={assets.icons.ic_receipt}
                  resizeMode="contain"
                />
                <AppText style={styles.emptyTitle}>
                  {'No personal transactions yet'}
                </AppText>
                <AppText style={styles.emptySubtitle}>
                  {'Tap + to add an expense or income.'}
                </AppText>
              </View>
            )
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          style={styles.list}
          data={expenses}
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
          ListEmptyComponent={
            loadState === 'loading' ? undefined : (
              <View style={styles.emptyState}>
                <Image
                  style={styles.emptyIcon}
                  source={assets.icons.ic_receipt}
                  resizeMode="contain"
                />
                <AppText style={styles.emptyTitle}>
                  {'No group expenses yet'}
                </AppText>
                <AppText style={styles.emptySubtitle}>
                  {'Tap + to add a split expense.'}
                </AppText>
              </View>
            )
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB: Opens Action Modal offering Personal vs Group split */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => setAddExpenseModalVisible(true)}
      >
        <AppText style={styles.fabIcon}>{' + '}</AppText>
      </Pressable>

      {/* Add Expense Action Picker Modal */}
      <AddExpenseActionModal
        visible={addExpenseModalVisible}
        onClose={() => setAddExpenseModalVisible(false)}
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
