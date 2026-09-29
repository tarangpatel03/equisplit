import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, Handshake } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { useCurrency } from '@/hooks';
import { colors, radius, space, useAppTheme } from '@/theme';
import { Expense } from '@/types';

type Props = {
  settlement: Expense;
  direction: 'received' | 'paid';
  amount: number;
  counterpartName: string;
  onPress?: () => void;
};

export const PersonalSettlementCard = memo(
  ({ settlement, direction, amount, counterpartName, onPress }: Props) => {
    const { colors: themeColors } = useAppTheme();
    const { currencySymbol } = useCurrency();

    const isReceived = direction === 'received';
    const amountColor = isReceived ? themeColors.credit : themeColors.debt;
    const sign = isReceived ? '+' : '-';
    const subtext = isReceived ? 'Settlement received' : 'Settlement paid';
    const title = isReceived
      ? `Settlement from ${counterpartName}`
      : `Settlement to ${counterpartName}`;

    const date = new Date(settlement.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

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
            styles.avatar,
            {
              backgroundColor: isReceived
                ? themeColors.creditLight
                : themeColors.debtLight,
            },
          ]}
        >
          {isReceived ? (
            <ArrowDownLeft
              size={22}
              color={themeColors.credit}
              strokeWidth={2.4}
            />
          ) : (
            <ArrowUpRight
              size={22}
              color={themeColors.debt}
              strokeWidth={2.4}
            />
          )}
        </View>

        <View style={styles.left}>
          <AppText
            style={[styles.title, { color: themeColors.textPrimary }]}
            numberOfLines={1}
          >
            {title}
          </AppText>
          <AppText
            style={[styles.meta, { color: themeColors.textSecondary }]}
            numberOfLines={1}
          >
            {`${date}  ·  Settlement`}
          </AppText>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.settlementBadge,
                {
                  backgroundColor: themeColors.surfaceAlt,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <Handshake
                size={11}
                color={themeColors.textSecondary}
                strokeWidth={2}
              />
              <AppText
                style={[
                  styles.badgeText,
                  { color: themeColors.textSecondary, marginLeft: 4 },
                ]}
              >
                {'Settlement'}
              </AppText>
            </View>
            <View
              style={[
                styles.directionBadge,
                {
                  backgroundColor: isReceived
                    ? themeColors.creditLight
                    : themeColors.debtLight,
                },
              ]}
            >
              <AppText
                style={[
                  styles.badgeText,
                  { color: isReceived ? themeColors.credit : themeColors.debt },
                ]}
              >
                {isReceived ? 'Received' : 'Paid'}
              </AppText>
            </View>
          </View>
        </View>

        <View style={styles.right}>
          <AppText style={[styles.amount, { color: amountColor }]}>
            {`${sign}${currencySymbol}${amount.toFixed(2)}`}
          </AppText>
          <AppText
            style={[styles.shareSubtext, { color: themeColors.textSecondary }]}
            numberOfLines={1}
          >
            {subtext}
          </AppText>
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
  avatar: {
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
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  meta: {
    fontSize: 12,
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settlementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  directionBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  shareSubtext: {
    fontSize: 11,
    fontWeight: '500',
  },
});
