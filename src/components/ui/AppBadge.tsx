import { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, space } from '@/theme';

import { AppText } from './AppText';

type Variant = 'credit' | 'debt' | 'neutral';

type Props = {
  label: string;
  amount: number;
  /** Positive = credit (you are owed), negative = debt (you owe), zero = settled. */
  variant?: Variant;
  compact?: boolean;
  style?: ViewStyle;
};

function resolveVariant(amount: number): Variant {
  if (amount > 0) return 'credit';
  if (amount < 0) return 'debt';
  return 'neutral';
}

export const AppBadge: FC<Props> = ({
  label,
  amount,
  variant,
  compact = true,
  style,
}) => {
  const resolvedVariant = variant ?? resolveVariant(amount);
  const absAmount = Math.abs(amount);
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : '';

  return (
    <View
      style={[
        styles.container,
        compact && styles.containerCompact,
        styles[resolvedVariant],
        style,
      ]}
    >
      <AppText
        style={[styles.name, compact && styles.nameCompact]}
        numberOfLines={1}
      >
        {label}
      </AppText>
      <AppText
        style={[
          styles.amount,
          compact && styles.amountCompact,
          styles[`${resolvedVariant}Text`],
        ]}
      >
        {`${sign}₹${absAmount.toFixed(2)}`}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    alignItems: 'center',
    minWidth: 90,
  },
  containerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: space.sm,
    minWidth: 0,
    borderRadius: radius.full,
  },
  // Variant backgrounds
  credit: {
    backgroundColor: colors.primaryLight,
  },
  debt: {
    backgroundColor: colors.debtLight,
  },
  neutral: {
    backgroundColor: colors.surfaceAlt,
  },
  name: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  nameCompact: {
    marginBottom: 0,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
  },
  amountCompact: {
    fontSize: 12,
    fontWeight: '700',
  },
  // Variant text colors
  creditText: {
    color: colors.credit,
  },
  debtText: {
    color: colors.debt,
  },
  neutralText: {
    color: colors.neutral,
  },
});
