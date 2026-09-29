import { ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-react-native';
import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useCurrency } from '@/hooks';
import { colors, hexToRgba, radius, space, useAppTheme } from '@/theme';

import type { PersonalAnalyticsType } from '@/screens/Analytics/hooks/useAnalytics';

type Props = {
  totalInflow: number;
  totalOutflow: number;
  netBalance: number;
  activeType?: PersonalAnalyticsType;
  onSelectType?: (type: PersonalAnalyticsType) => void;
};

export const PersonalSummaryCards: FC<Props> = ({
  totalInflow,
  totalOutflow,
  netBalance,
  activeType,
  onSelectType,
}) => {
  const { colors: themeColors, isDark } = useAppTheme();
  const { currencySymbol } = useCurrency();
  const netSign = netBalance > 0 ? '+' : netBalance < 0 ? '-' : '';
  const absNet = Math.abs(netBalance);
  const netColor =
    netBalance > 0.005
      ? themeColors.credit
      : netBalance < -0.005
      ? themeColors.debt
      : themeColors.textPrimary;

  const isIncomeActive = activeType === 'income';
  const isExpenseActive = activeType === 'expense';

  return (
    <View style={styles.container}>
      {/* Side-by-Side Inflow & Outflow Cards */}
      <View style={styles.cardsRow}>
        {/* Total Inflow Card */}
        <Pressable
          disabled={!onSelectType}
          onPress={() => onSelectType?.('income')}
          style={[
            styles.card,
            styles.inflowCard,
            isIncomeActive && styles.activeCard,
            {
              backgroundColor: isDark
                ? hexToRgba(themeColors.credit, 0.06)
                : hexToRgba(themeColors.credit, 0.09),
              borderColor: isIncomeActive
                ? themeColors.credit
                : isDark
                ? hexToRgba(themeColors.credit, 0.2)
                : themeColors.transparent,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <View
              style={[
                styles.iconPill,
                { backgroundColor: themeColors.primaryLight },
              ]}
            >
              <ArrowDownLeft
                size={13}
                color={themeColors.credit}
                strokeWidth={2.4}
              />
            </View>
            <AppText
              style={[
                styles.label,
                { color: themeColors.textSecondary },
                isIncomeActive && [
                  styles.activeLabelText,
                  { color: themeColors.credit },
                ],
              ]}
              numberOfLines={1}
            >
              {'Total Inflow'}
            </AppText>
          </View>
          <AppText
            style={[styles.amount, { color: themeColors.credit }]}
            numberOfLines={1}
          >
            {`+${currencySymbol}${totalInflow.toFixed(2)}`}
          </AppText>
        </Pressable>

        {/* Total Outflow Card */}
        <Pressable
          disabled={!onSelectType}
          onPress={() => onSelectType?.('expense')}
          style={[
            styles.card,
            styles.outflowCard,
            isExpenseActive && styles.activeCard,
            {
              backgroundColor: isDark
                ? hexToRgba(themeColors.debt, 0.06)
                : hexToRgba(themeColors.debt, 0.09),
              borderColor: isExpenseActive
                ? themeColors.debt
                : isDark
                ? hexToRgba(themeColors.debt, 0.2)
                : themeColors.transparent,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <View
              style={[
                styles.iconPill,
                { backgroundColor: themeColors.debtLight },
              ]}
            >
              <ArrowUpRight
                size={13}
                color={themeColors.debt}
                strokeWidth={2.4}
              />
            </View>
            <AppText
              style={[
                styles.label,
                { color: themeColors.textSecondary },
                isExpenseActive && [
                  styles.activeLabelText,
                  { color: themeColors.debt },
                ],
              ]}
              numberOfLines={1}
            >
              {'Total Outflow'}
            </AppText>
          </View>
          <AppText
            style={[styles.amount, { color: themeColors.debt }]}
            numberOfLines={1}
          >
            {`-${currencySymbol}${totalOutflow.toFixed(2)}`}
          </AppText>
        </Pressable>
      </View>

      {/* Net Balance Footer */}
      <View
        style={[
          styles.netFooter,
          {
            backgroundColor: themeColors.surfaceAlt,
            borderColor: themeColors.border,
          },
        ]}
      >
        <View style={styles.netLeft}>
          <Scale size={14} color={themeColors.textSecondary} strokeWidth={2} />
          <AppText
            style={[styles.netLabel, { color: themeColors.textSecondary }]}
          >
            {'Net Balance'}
          </AppText>
        </View>
        <AppText
          style={[styles.netAmount, { color: netColor }]}
          numberOfLines={1}
        >
          {`${netSign}${currencySymbol}${absNet.toFixed(2)}`}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: space.md,
    marginBottom: space.md,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: space.sm,
    marginBottom: space.xs + 2,
  },
  card: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    borderRadius: radius.xl,
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.sm + 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inflowCard: {},
  outflowCard: {},
  activeCard: {
    borderWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  iconPill: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  activeLabelText: {
    fontWeight: '800',
  },
  amount: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  netFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: 7,
    paddingHorizontal: space.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  netLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  netLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  netAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
});
