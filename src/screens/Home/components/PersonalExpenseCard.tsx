import { memo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import { assets } from '@/assets';
import { CategoryIcon } from '@/components/common';
import { AppText } from '@/components/ui/AppText';
import { getCategoryBgColor, getCategoryById } from '@/config';
import { RootState } from '@/store/store';
import { colors, radius, space } from '@/theme';
import { PersonalExpense } from '@/types';

type Props = {
  expense: PersonalExpense;
  onPress: () => void;
  onDelete: () => void;
};

export const PersonalExpenseCard = memo(
  ({ expense, onPress, onDelete }: Props) => {
    const categories = useSelector((s: RootState) => s.categories.categories);
    const category = getCategoryById(expense.categoryId, categories);

    const isIncome = expense.type === 'income';

    const date = new Date(expense.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const amountPrefix = isIncome ? '+' : '-';
    const amountColor = isIncome ? colors.credit : colors.textPrimary;

    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={onPress}
      >
        <View
          style={[
            styles.categoryAvatar,
            { backgroundColor: getCategoryBgColor(category.color, 0.16) },
          ]}
        >
          <CategoryIcon
            iconKey={category.iconKey}
            size={24}
            color={category.color}
            strokeWidth={2}
          />
        </View>

        <View style={styles.left}>
          <AppText style={styles.title} numberOfLines={1}>
            {expense.title}
          </AppText>
          <AppText style={styles.meta} numberOfLines={1}>
            {expense.note ? `${date}  ·  ${expense.note}` : date}
          </AppText>
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <AppText style={styles.categoryBadgeText}>
                {category.name}
              </AppText>
            </View>
            <View
              style={[
                styles.typeBadge,
                isIncome ? styles.typeBadgeIncome : styles.typeBadgeExpense,
              ]}
            >
              <AppText
                style={[
                  styles.typeBadgeText,
                  isIncome
                    ? styles.typeBadgeTextIncome
                    : styles.typeBadgeTextExpense,
                ]}
              >
                {isIncome ? 'Income' : 'Expense'}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.right}>
          <AppText style={[styles.amount, { color: amountColor }]}>
            {`${amountPrefix}₹${expense.amount.toFixed(2)}`}
          </AppText>
          <Pressable
            onPress={onDelete}
            hitSlop={8}
            style={({ pressed }) => [
              styles.deleteBtn,
              pressed && styles.deleteBtnPressed,
            ]}
          >
            <Image
              source={assets.icons.ic_delete}
              style={styles.deleteIcon}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.88,
    backgroundColor: colors.surfaceAlt,
  },
  categoryAvatar: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: space.sm,
  },
  left: {
    flex: 1,
    marginRight: space.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: space.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: space.xs + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  typeBadgeIncome: {
    backgroundColor: colors.primaryLight,
  },
  typeBadgeExpense: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  typeBadgeTextIncome: {
    color: colors.primary,
  },
  typeBadgeTextExpense: {
    color: colors.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 2,
    gap: space.md,
    flexShrink: 0,
  },
  amount: {
    fontSize: 17,
    fontWeight: '700',
  },
  deleteBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnPressed: {
    opacity: 0.7,
    backgroundColor: colors.debtLight,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    tintColor: colors.debt,
  },
});
