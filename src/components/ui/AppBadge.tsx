import { FC } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useCurrency } from '@/hooks';
import { colors, radius, space, useAppTheme } from '@/theme';

import { AppText } from './AppText';

type Variant = 'credit' | 'debt' | 'neutral';

type Props = {
  label: string;
  amount: number;
  /** Positive = credit (you are owed), negative = debt (you owe), zero = settled. */
  variant?: Variant;
  currencySymbol?: string;
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
  currencySymbol: propSymbol,
  compact = true,
  style,
}) => {
  const { colors: themeColors } = useAppTheme();
  const { currencySymbol: defaultSymbol } = useCurrency();
  const symbol = propSymbol ?? defaultSymbol;
  const resolvedVariant = variant ?? resolveVariant(amount);
  const absAmount = Math.abs(amount);
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : '';

  const variantStyles = {
    credit: {
      backgroundColor: themeColors.primaryLight,
    },
    debt: {
      backgroundColor: themeColors.debtLight,
    },
    neutral: {
      backgroundColor: themeColors.surfaceAlt,
    },
  };

  const textColors = {
    credit: themeColors.credit,
    debt: themeColors.debt,
    neutral: themeColors.neutral,
  };

  return (
    <View
      style={[
        styles.container,
        compact && styles.containerCompact,
        variantStyles[resolvedVariant],
        style,
      ]}
    >
      <AppText
        style={[
          styles.name,
          compact && [styles.nameCompact, { color: themeColors.textPrimary }],
        ]}
        numberOfLines={1}
      >
        {label}
      </AppText>
      <AppText
        style={[
          styles.amount,
          compact && styles.amountCompact,
          { color: textColors[resolvedVariant] },
        ]}
      >
        {`${sign}${symbol}${absAmount.toFixed(2)}`}
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
