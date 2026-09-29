import { FC, useCallback, useState } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import { assets } from '@/assets';
import { AppConfirmDialog, CategoryIcon } from '@/components/common';
import { AppButton } from '@/components/ui/AppButton';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { getCategoryBgColor, getCategoryById } from '@/config';
import { useCurrency } from '@/hooks';
import { RootRoutes } from '@/navigation/routes';
import { deleteExpense as deleteExpenseDb } from '@/services/database';
import { showSuccessToast } from '@/services/toast/toast.service';
import { deleteExpense } from '@/store/expenseSlice';
import { RootState } from '@/store/store';
import { RootRouteParams } from '@/types/navigation.types';

import { styles } from './styles';

type NavigationProp = NativeStackNavigationProp<RootRouteParams>;
type DetailsRouteProp = RouteProp<
  RootRouteParams,
  typeof RootRoutes.SplitDetails
>;

const SPLIT_MODE_LABELS: Record<string, string> = {
  equally: 'Split Equally',
  shares: 'Split by Shares',
  perItem: 'Itemized Split',
  amount: 'Split by Exact Amount',
  settlement: 'Debt Settlement',
};

export const SplitDetailsScreen: FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailsRouteProp>();
  const dispatch = useDispatch();
  const { currencySymbol } = useCurrency();

  const { expenseId } = route.params;

  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const expenses = useSelector((state: RootState) => state.expenses.expenses);
  const members = useSelector((state: RootState) => state.members.members);
  const categories = useSelector((s: RootState) => s.categories.categories);

  const expense = expenses.find(e => e.id === expenseId);

  const getMemberName = useCallback(
    (id: string) => members.find(m => m.id === id)?.name ?? 'Unknown',
    [members],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!expense) return;
    setDeleting(true);
    try {
      await deleteExpenseDb(expense.id);
      dispatch(deleteExpense(expense.id));
      showSuccessToast('Expense deleted');
      setConfirmDeleteVisible(false);
      navigation.goBack();
    } finally {
      setDeleting(false);
    }
  }, [expense, dispatch, navigation]);

  const handleDelete = useCallback(() => {
    setConfirmDeleteVisible(true);
  }, []);

  const handleEdit = useCallback(() => {
    if (!expense) return;
    navigation.navigate(RootRoutes.AddEditExpense, { expenseId: expense.id });
  }, [expense, navigation]);

  if (!expense) {
    return (
      <AppScreen screenTitle="Split Details">
        <View style={styles.emptyContainer}>
          <Image
            source={assets.icons.ic_search}
            style={styles.emptyIcon}
            resizeMode="contain"
          />
          <AppText style={styles.emptyTitle}>{'Expense not found'}</AppText>
          <AppButton
            label="Go Back"
            variant="ghost"
            onPress={() => navigation.goBack()}
          />
        </View>
      </AppScreen>
    );
  }

  const formattedDate = new Date(expense.createdAt).toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  );
  const category = getCategoryById(expense.categoryId, categories);

  return (
    <AppScreen screenTitle="Expense Details" showBackButton>
      <ScrollView
        style={styles.flex1}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View
            style={[
              styles.categoryHeroAvatar,
              { backgroundColor: getCategoryBgColor(category.color, 0.16) },
            ]}
          >
            <CategoryIcon
              iconKey={category.iconKey}
              size={32}
              color={category.color}
              strokeWidth={2}
            />
          </View>
          <AppText style={styles.heroTitle}>{expense.title}</AppText>
          <AppText style={styles.heroAmount}>
            {`${currencySymbol}${expense.totalAmount.toFixed(2)}`}
          </AppText>
          <View style={styles.dateRow}>
            <Image
              source={assets.icons.ic_calendar}
              style={styles.calendarIcon}
              resizeMode="contain"
            />
            <AppText style={styles.heroDate}>{formattedDate}</AppText>
          </View>
          <View style={styles.tagsRow}>
            <View style={styles.categoryPill}>
              <AppText style={styles.categoryPillText}>{category.name}</AppText>
            </View>
            <View style={styles.badgePill}>
              <AppText style={styles.badgePillText}>
                {SPLIT_MODE_LABELS[expense.splitMode] ?? expense.splitMode}
              </AppText>
            </View>
          </View>
        </View>

        {/* Paid By / Payers Card */}
        <View style={styles.sectionCard}>
          <AppText style={styles.sectionTitle}>{'Paid By'}</AppText>
          {expense.payers.map(p => (
            <View key={p.memberId} style={styles.row}>
              <AppText style={styles.rowName}>
                {getMemberName(p.memberId)}
              </AppText>
              <AppText style={styles.rowAmount}>
                {`${currencySymbol}${p.amount.toFixed(2)}`}
              </AppText>
            </View>
          ))}
        </View>

        {/* Split Breakdown / Participants Card */}
        <View style={styles.sectionCard}>
          <AppText style={styles.sectionTitle}>{'Split Breakdown'}</AppText>
          {expense.participants.map(p => (
            <View key={p.memberId} style={styles.row}>
              <View style={styles.flex1}>
                <AppText style={styles.rowName}>
                  {getMemberName(p.memberId)}
                </AppText>
                {p.rawValue !== undefined && expense.splitMode === 'shares' ? (
                  <AppText style={styles.rowSubtext}>
                    {`${p.rawValue} ${p.rawValue === 1 ? 'share' : 'shares'}`}
                  </AppText>
                ) : null}
              </View>
              <AppText style={styles.rowAmount}>
                {`${currencySymbol}${p.share.toFixed(2)}`}
              </AppText>
            </View>
          ))}
        </View>

        {/* Itemized list if perItem */}
        {expense.splitMode === 'perItem' && expense.items ? (
          <View style={styles.sectionCard}>
            <AppText style={styles.sectionTitle}>{'Items'}</AppText>
            {expense.items.map((item, idx) => {
              const assigneeNames = item.assignedTo
                .map(getMemberName)
                .join(', ');
              return (
                <View key={idx} style={styles.itemCard}>
                  <View style={styles.itemTopRow}>
                    <AppText style={styles.itemName}>
                      {item.name || `Item #${idx + 1}`}
                    </AppText>
                    <AppText style={styles.itemCost}>
                      {`${currencySymbol}${item.cost.toFixed(2)}`}
                    </AppText>
                  </View>
                  <AppText style={styles.itemAssignees}>
                    {`Shared by: ${assigneeNames || 'None'}`}
                  </AppText>
                </View>
              );
            })}
          </View>
        ) : null}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <View style={styles.actionBtnWrapper}>
          <AppButton label="Edit Expense" onPress={handleEdit} fullWidth />
        </View>
        <View style={styles.actionBtnWrapper}>
          <AppButton
            label="Delete Expense"
            variant="danger"
            onPress={handleDelete}
            fullWidth
          />
        </View>
      </View>

      {/* Custom Confirm Delete Dialog */}
      <AppConfirmDialog
        visible={confirmDeleteVisible}
        title="Delete Expense"
        message={`Are you sure you want to delete "${expense.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDeleteVisible(false)}
      />
    </AppScreen>
  );
};
