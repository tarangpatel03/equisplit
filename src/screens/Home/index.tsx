import { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutGrid } from 'lucide-react-native';

import { AppConfirmDialog, CategoryManagerModal } from '@/components/common';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme';
import { RootRoutes } from '@/navigation/routes';
import { deleteExpense as deleteExpenseDb } from '@/services/database';
import { showSuccessToast } from '@/services/toast/toast.service';
import { deleteExpense } from '@/store/expenseSlice';
import { RootState } from '@/store/store';
import { Expense } from '@/types';

import { ExpenseCard } from './components/ExpenseCard';
import { useHomeScreen } from './hooks/useHomeScreen';
import { styles } from './styles';
import { assets } from '@/assets';
import { NavType } from '@/navigation/navigation.service';

export const HomeScreen = () => {
  const navigation = useNavigation<NavType>();
  const dispatch = useDispatch();
  const categories = useSelector((s: RootState) => s.categories.categories);

  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [categoryManagerVisible, setCategoryManagerVisible] = useState(false);

  const { members, expenses, loadState, retry } = useHomeScreen();

  const handleConfirmDelete = useCallback(async () => {
    if (!expenseToDelete) return;
    setDeleting(true);
    try {
      await deleteExpenseDb(expenseToDelete.id);
      dispatch(deleteExpense(expenseToDelete.id));
      showSuccessToast('Expense deleted');
      setExpenseToDelete(null);
    } finally {
      setDeleting(false);
    }
  }, [expenseToDelete, dispatch]);

  if (loadState === 'error') {
    return (
      <AppScreen screenTitle="SplitWise Expense Tracker">
        <View style={styles.centerState}>
          <AppText style={styles.errorText}>{'Failed to load data.'}</AppText>
          <Pressable onPress={retry} style={styles.retryBtn}>
            <AppText style={styles.retryText}>{'Tap to retry'}</AppText>
          </Pressable>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen
      screenTitle="SplitWise Expense Tracker"
      preset="fixed"
      safeAreaEdges={['top']}
    >
      {/* Expense list header with Categories action */}
      <View style={styles.listHeader}>
        <View style={styles.headerTitleRow}>
          <AppText style={styles.sectionLabel}>{'Expenses'}</AppText>
          {expenses.length > 0 && (
            <View style={styles.expensesCountBadge}>
              <AppText style={styles.expensesCountText}>
                {expenses.length}
              </AppText>
            </View>
          )}
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
              <AppText style={styles.emptyTitle}>{'No expenses yet'}</AppText>
              <AppText style={styles.emptySubtitle}>
                {'Tap + to add your first expense.'}
              </AppText>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => navigation.navigate(RootRoutes.AddEditExpense)}
      >
        <AppText style={styles.fabIcon}>{' + '}</AppText>
      </Pressable>

      {/* Custom Confirm Delete Dialog */}
      <AppConfirmDialog
        visible={Boolean(expenseToDelete)}
        title="Delete Expense"
        message={`Are you sure you want to delete "${expenseToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setExpenseToDelete(null)}
      />

      {/* Global Category Manager Modal */}
      <CategoryManagerModal
        visible={categoryManagerVisible}
        onClose={() => setCategoryManagerVisible(false)}
      />
    </AppScreen>
  );
};
