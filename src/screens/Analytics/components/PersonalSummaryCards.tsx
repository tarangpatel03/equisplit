import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, space, useAppTheme } from '@/theme';

type Props = {
  totalInflow: number;
  totalOutflow: number;
  netBalance: number;
};

export const PersonalSummaryCards: FC<Props> = ({
  totalInflow,
  totalOutflow,
  netBalance,
}) => {
  const { colors: themeColors, isDark } = useAppTheme();
  const netSign = netBalance > 0 ? '+' : netBalance < 0 ? '-' : '';
  const absNet = Math.abs(netBalance);
  const netColor =
    netBalance > 0.005
      ? themeColors.credit
      : netBalance < -0.005
      ? themeColors.debt
      : themeColors.textPrimary;

  return (
    <View style={styles.container}>
      {/* Side-by-Side Inflow & Outflow Cards */}
      <View style={styles.cardsRow}>
        {/* Total Inflow Card */}
        <View
          style={[
            styles.card,
            styles.inflowCard,
            {
              backgroundColor: isDark
                ? 'rgba(32, 217, 178, 0.06)'
                : 'rgba(32, 217, 178, 0.09)',
              borderWidth: isDark ? 1 : 0,
              borderColor: isDark ? 'rgba(32, 217, 178, 0.2)' : 'transparent',
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
              style={[styles.label, { color: themeColors.textSecondary }]}
              numberOfLines={1}
            >
              {'Total Inflow'}
            </AppText>
          </View>
          <AppText
            style={[styles.amount, { color: themeColors.credit }]}
            numberOfLines={1}
          >
            {`+₹${totalInflow.toFixed(2)}`}
          </AppText>
        </View>

        {/* Total Outflow Card */}
        <View
          style={[
            styles.card,
            styles.outflowCard,
            {
              backgroundColor: isDark
                ? 'rgba(255, 107, 107, 0.06)'
                : 'rgba(255, 107, 107, 0.09)',
              borderWidth: isDark ? 1 : 0,
              borderColor: isDark ? 'rgba(255, 107, 107, 0.2)' : 'transparent',
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
              style={[styles.label, { color: themeColors.textSecondary }]}
              numberOfLines={1}
            >
              {'Total Outflow'}
            </AppText>
          </View>
          <AppText
            style={[styles.amount, { color: themeColors.debt }]}
            numberOfLines={1}
          >
            {`-₹${totalOutflow.toFixed(2)}`}
          </AppText>
        </View>
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
          {`${netSign}₹${absNet.toFixed(2)}`}
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
    borderWidth: 0,
  },
  inflowCard: {},
  outflowCard: {},
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
    borderColor: 'rgba(255, 255, 255, 0.04)',
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
