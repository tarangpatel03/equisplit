import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ChevronRight, Users } from 'lucide-react-native';

import { CategoryIcon } from '@/components/common';
import { AppText } from '@/components/ui/AppText';
import { getCategoryBgColor, getCategoryById } from '@/config';
import { RootState } from '@/store/store';
import { colors, radius, space } from '@/theme';
import { Expense } from '@/types';

type Props = {
  expense: Expense;
  userShare: number;
  payerLabel: string;
  onPress: () => void;
};

export const PersonalGroupExpenseCard = memo(
  ({ expense, userShare, payerLabel, onPress }: Props) => {
    const categories = useSelector((s: RootState) => s.categories.categories);
    const category = getCategoryById(expense.categoryId, categories);

    const date = new Date(expense.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

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
            {`${date}  ·  ${payerLabel}`}
          </AppText>
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <AppText style={styles.categoryBadgeText}>
                {category.name}
              </AppText>
            </View>
            <View style={styles.groupBadge}>
              <Users size={10} color={colors.primary} strokeWidth={2.4} />
              <AppText style={styles.groupBadgeText}>{'Group'}</AppText>
            </View>
          </View>
        </View>

        <View style={styles.right}>
          <AppText style={styles.amount}>
            {`-₹${userShare.toFixed(2)}`}
          </AppText>
          <View style={styles.shareRow}>
            <AppText style={styles.shareSubtext}>{'Your share'}</AppText>
            <ChevronRight size={14} color={colors.textSecondary} />
          </View>
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
  groupBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: space.xs + 3,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(32, 217, 178, 0.3)',
  },
  groupBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 2,
    gap: space.sm,
    flexShrink: 0,
  },
  amount: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.debt,
  },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  shareSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
