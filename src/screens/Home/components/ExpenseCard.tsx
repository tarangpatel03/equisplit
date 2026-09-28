import { memo, useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';

import { assets } from '@/assets';
import { AppText } from '@/components/ui/AppText';
import { CategoryIcon } from '@/components/common';
import { getCategoryBgColor, getCategoryById } from '@/config';
import { colors, radius, space } from '@/theme';
import { RootState } from '@/store/store';
import { Expense, Member } from '@/types';

type Props = {
  expense: Expense;
  members: Member[];
  onPress: () => void;
  onDelete: () => void;
};

function getMemberName(members: Member[], id: string): string {
  return members.find(m => m.id === id)?.name ?? 'Unknown';
}

export const ExpenseCard = memo(
  ({ expense, members, onPress, onDelete }: Props) => {
    const categories = useSelector((s: RootState) => s.categories.categories);
    const category = getCategoryById(expense.categoryId, categories);

    const payerNames = expense.payers
      .map(p => getMemberName(members, p.memberId))
      .join(', ');

    const date = new Date(expense.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });

    const participantCount = expense.participants?.length ?? 0;
    const participantText = `${participantCount} ${
      participantCount === 1 ? 'member' : 'members'
    }`;

    const modeLabel =
      expense.splitMode === 'settlement'
        ? 'Settlement'
        : expense.splitMode === 'equally'
        ? 'Split equally'
        : expense.splitMode === 'shares'
        ? 'By shares'
        : expense.splitMode === 'perItem'
        ? 'Per item'
        : 'Exact amount';

    const splitBadgeLabel =
      expense.splitMode === 'settlement'
        ? 'Settlement'
        : participantCount > 0
        ? `${modeLabel} • ${participantText}`
        : modeLabel;

    const primaryMember = members.find(m => m.isPrimary);
    const primaryId = primaryMember?.id;

    const stance = useMemo(() => {
      if (!primaryId) return null;

      if (expense.splitMode === 'settlement') {
        const paid =
          expense.payers.find(p => p.memberId === primaryId)?.amount ?? 0;
        const received =
          expense.participants.find(p => p.memberId === primaryId)?.share ?? 0;
        if (paid > 0) {
          return {
            label: `You paid ₹${paid.toFixed(2)}`,
            color: colors.credit,
            bg: 'rgba(46, 213, 115, 0.12)',
            borderColor: 'rgba(46, 213, 115, 0.35)',
          };
        }
        if (received > 0) {
          return {
            label: `You received ₹${received.toFixed(2)}`,
            color: colors.primary,
            bg: 'rgba(32, 217, 178, 0.12)',
            borderColor: 'rgba(32, 217, 178, 0.35)',
          };
        }
        return {
          label: 'Not involved',
          color: colors.textSecondary,
          bg: colors.surfaceAlt,
          borderColor: colors.border,
        };
      }

      const amountPaid =
        expense.payers.find(p => p.memberId === primaryId)?.amount ?? 0;
      const shareOwed =
        expense.participants.find(p => p.memberId === primaryId)?.share ?? 0;
      const net = Math.round((amountPaid - shareOwed) * 100) / 100;

      if (net > 0.005) {
        return {
          label: `You lent ₹${net.toFixed(2)}`,
          color: colors.credit,
          bg: 'rgba(46, 213, 115, 0.12)',
          borderColor: 'rgba(46, 213, 115, 0.35)',
        };
      } else if (net < -0.005) {
        return {
          label: `You owe ₹${Math.abs(net).toFixed(2)}`,
          color: colors.debt,
          bg: 'rgba(255, 107, 107, 0.12)',
          borderColor: 'rgba(255, 107, 107, 0.35)',
        };
      } else if (amountPaid > 0) {
        return {
          label: 'You paid your share',
          color: colors.primary,
          bg: 'rgba(32, 217, 178, 0.12)',
          borderColor: 'rgba(32, 217, 178, 0.35)',
        };
      } else {
        return {
          label: 'Not involved',
          color: colors.textSecondary,
          bg: colors.surfaceAlt,
          borderColor: colors.border,
        };
      }
    }, [expense, primaryId]);

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
            <View style={styles.categoryBadge}>
              <AppText style={styles.categoryBadgeText}>
                {category.name}
              </AppText>
            </View>
            <View style={styles.splitBadge}>
              <AppText style={styles.splitBadgeText}>{splitBadgeLabel}</AppText>
            </View>
          </View>
        </View>

        <View style={styles.right}>
          <AppText style={styles.amount}>{`₹${expense.totalAmount.toFixed(
            2,
          )}`}</AppText>
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
  stanceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: space.xs + 3,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  stanceBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
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
  splitBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  splitBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
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
    color: colors.textPrimary,
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
