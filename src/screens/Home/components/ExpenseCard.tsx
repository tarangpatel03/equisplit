import { FC, memo, useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import { assets } from '@/assets';
import { CategoryIcon } from '@/components/common';
import { AppText } from '@/components/ui/AppText';
import { getCategoryBgColor, getCategoryById } from '@/config';
import { useCurrency } from '@/hooks';
import { RootState } from '@/store/store';
import { colors, hexToRgba, radius, space, useAppTheme } from '@/theme';
import { Expense, Member } from '@/types';

type Props = {
  expense: Expense;
  members: Member[];
  onPress: () => void;
  onDelete: () => void;
};

export const ExpenseCard: FC<Props> = memo(
  ({ expense, members, onPress, onDelete }) => {
    const { colors: themeColors } = useAppTheme();
    const { currencySymbol } = useCurrency();
    const categories = useSelector((s: RootState) => s.categories.categories);
    const category = getCategoryById(expense.categoryId, categories);

    const payerNames = useMemo(() => {
      if (!expense.payers || expense.payers.length === 0) return '';
      return expense.payers
        .map(p => {
          const m = members.find(mem => mem.id === p.memberId);
          return m ? m.name : 'Unknown';
        })
        .join(', ');
    }, [expense.payers, members]);

    const date = new Date(expense.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const splitBadgeLabel = useMemo(() => {
      switch (expense.splitMode) {
        case 'shares':
          return 'Shares';
        case 'perItem':
          return 'Itemized';
        case 'amount':
          return 'Exact';
        case 'settlement':
          return 'Settlement';
        default:
          return 'Equally';
      }
    }, [expense.splitMode]);

    const primaryMember = members.find(m => m.isPrimary);
    const primaryId = primaryMember?.id;

    // Determine the user's stance on this expense
    const stance = useMemo(() => {
      if (!primaryId) return null;

      if (expense.splitMode === 'settlement') {
        const isPayer = expense.payers.some(p => p.memberId === primaryId);
        const isReceiver = expense.participants.some(
          p => p.memberId === primaryId,
        );
        if (isPayer) {
          return {
            label: 'You paid debt',
            color: themeColors.primary,
            bg: themeColors.primaryLight,
            borderColor: hexToRgba(themeColors.primary, 0.35),
          };
        }
        if (isReceiver) {
          return {
            label: 'You received debt',
            color: themeColors.credit,
            bg: themeColors.settlementLight,
            borderColor: hexToRgba(themeColors.settlement, 0.35),
          };
        }
        return {
          label: 'Debt settlement',
          color: themeColors.textSecondary,
          bg: themeColors.surfaceAlt,
          borderColor: themeColors.border,
        };
      }

      const amountPaid =
        expense.payers.find(p => p.memberId === primaryId)?.amount ?? 0;
      const shareOwed =
        expense.participants.find(p => p.memberId === primaryId)?.share ?? 0;
      const net = Math.round((amountPaid - shareOwed) * 100) / 100;

      if (net > 0.005) {
        return {
          label: `You lent ${currencySymbol}${net.toFixed(2)}`,
          color: themeColors.credit,
          bg: themeColors.settlementLight,
          borderColor: hexToRgba(themeColors.settlement, 0.35),
        };
      } else if (net < -0.005) {
        return {
          label: `You owe ${currencySymbol}${Math.abs(net).toFixed(2)}`,
          color: themeColors.debt,
          bg: themeColors.debtLight,
          borderColor: hexToRgba(themeColors.debt, 0.35),
        };
      } else if (amountPaid > 0) {
        return {
          label: 'You paid your share',
          color: themeColors.primary,
          bg: themeColors.primaryLight,
          borderColor: hexToRgba(themeColors.primary, 0.35),
        };
      } else {
        return {
          label: 'Not involved',
          color: themeColors.textSecondary,
          bg: themeColors.surfaceAlt,
          borderColor: themeColors.border,
        };
      }
    }, [currencySymbol, expense, primaryId, themeColors]);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
          },
          pressed && { backgroundColor: themeColors.surfaceAlt },
        ]}
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
          <AppText
            style={[styles.title, { color: themeColors.textPrimary }]}
            numberOfLines={1}
          >
            {expense.title}
          </AppText>
          <AppText
            style={[styles.meta, { color: themeColors.textSecondary }]}
            numberOfLines={1}
          >
            {`Paid by ${payerNames || 'Unknown'}  ·  ${date}`}
          </AppText>
          <View style={styles.badgeRow}>
            {stance && (
              <View
                style={[
                  styles.stanceBadge,
                  {
                    backgroundColor: stance.bg,
                    borderColor: stance.borderColor,
                  },
                ]}
              >
                <AppText
                  style={[styles.stanceBadgeText, { color: stance.color }]}
                >
                  {stance.label}
                </AppText>
              </View>
            )}
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor: themeColors.surfaceAlt,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <AppText
                style={[
                  styles.categoryBadgeText,
                  { color: themeColors.textSecondary },
                ]}
              >
                {category.name}
              </AppText>
            </View>
            <View
              style={[
                styles.splitBadge,
                { backgroundColor: themeColors.surfaceAlt },
              ]}
            >
              <AppText
                style={[
                  styles.splitBadgeText,
                  { color: themeColors.textSecondary },
                ]}
              >
                {splitBadgeLabel}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.right}>
          <AppText
            style={[styles.amount, { color: themeColors.textPrimary }]}
          >{`${currencySymbol}${expense.totalAmount.toFixed(2)}`}</AppText>
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
    shadowColor: colors.shadow,
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
  categoryIconImg: {
    width: 32,
    height: 32,
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
    fontWeight: '600',
    color: colors.textSecondary,
  },
  splitBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: space.xs + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  splitBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  stanceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: space.xs + 2,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  stanceBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 52,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  deleteBtn: {
    padding: space.xs,
    marginTop: space.xs,
  },
  deleteBtnPressed: {
    opacity: 0.5,
  },
  deleteIcon: {
    width: 18,
    height: 18,
    tintColor: colors.error,
  },
});
