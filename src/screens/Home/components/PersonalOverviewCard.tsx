import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { useCurrency, usePreferences } from '@/hooks';
import { colors, hexToRgba, radius, space, useAppTheme } from '@/theme';
import { Expense, Member, PersonalExpense } from '@/types';

type Props = {
  personalExpenses: PersonalExpense[];
  expenses: Expense[];
  members: Member[];
};

export const PersonalOverviewCard = memo(
  ({ personalExpenses, expenses, members }: Props) => {
    const { colors: themeColors } = useAppTheme();
    const { currencySymbol } = useCurrency();
    const { trackOutOfPocket } = usePreferences();

    const {
      totalInflow,
      totalOutflow,
      finalNet,
      personalIncome,
      personalSpend,
      groupSpend,
      groupExpenseOutflow,
      settlementsReceived,
    } = useMemo(() => {
      let income = 0;
      let spend = 0;

      for (const item of personalExpenses) {
        if (item.type === 'income') {
          income += item.amount;
        } else {
          spend += item.amount;
        }
      }

      const primaryMember = members.find(m => m.isPrimary);
      let gSpend = 0;
      let gExpenseOutflow = 0;
      let sReceived = 0;

      if (primaryMember) {
        for (const exp of expenses) {
          if (exp.splitMode === 'settlement') {
            const receiverId = exp.participants?.[0]?.memberId;
            if (receiverId === primaryMember.id) {
              sReceived += exp.totalAmount;
            }
          } else {
            const participant = exp.participants?.find(
              p => p.memberId === primaryMember.id,
            );
            if (participant && participant.share > 0) {
              gSpend += participant.share;
            }

            const userPayer = exp.payers?.find(
              p => p.memberId === primaryMember.id,
            );
            if (userPayer && userPayer.amount > 0) {
              // Primary user paid out of pocket (Scenarios 1 & 3)
              gExpenseOutflow += userPayer.amount;
            } else if (participant && participant.share > 0) {
              // Another member paid; primary user's consumed share is counted (Scenarios 2 & 4)
              gExpenseOutflow += participant.share;
            }
          }
        }
      }

      let inflow: number;
      let outflow: number;

      if (trackOutOfPocket) {
        inflow = income + sReceived;
        outflow = spend + gExpenseOutflow;
      } else {
        inflow = income;
        outflow = spend + gSpend;
      }

      const netResult = inflow - outflow;

      return {
        totalInflow: Math.round(inflow * 100) / 100,
        totalOutflow: Math.round(outflow * 100) / 100,
        finalNet: Math.round(netResult * 100) / 100,
        personalIncome: income,
        personalSpend: spend,
        groupSpend: gSpend,
        groupExpenseOutflow: gExpenseOutflow,
        settlementsReceived: sReceived,
      };
    }, [personalExpenses, expenses, members, trackOutOfPocket]);

    const netSign = finalNet > 0 ? '+' : finalNet < 0 ? '-' : '';
    const absNet = Math.abs(finalNet);
    const netColor =
      finalNet > 0.005
        ? themeColors.credit
        : finalNet < -0.005
        ? themeColors.debt
        : themeColors.textPrimary;

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
          },
        ]}
      >
        {/* Top: Side-by-Side Inflow & Outflow Cards */}
        <View style={styles.flowRow}>
          {/* Inflow Box */}
          <View style={[styles.flowBox, styles.inflowBox]}>
            <View style={styles.flowHeader}>
              <View style={[styles.flowIconPill, styles.inflowIconPill]}>
                <ArrowDownLeft
                  size={13}
                  color={themeColors.credit}
                  strokeWidth={2.4}
                />
              </View>
              <AppText
                style={[styles.flowLabel, { color: themeColors.textSecondary }]}
                numberOfLines={1}
              >
                {'Total Inflow'}
              </AppText>
            </View>

            <AppText
              style={[styles.flowAmount, { color: themeColors.credit }]}
              numberOfLines={1}
            >
              {`+${currencySymbol}${totalInflow.toFixed(2)}`}
            </AppText>

            <AppText
              style={[styles.flowSubtext, { color: themeColors.textSecondary }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {trackOutOfPocket && settlementsReceived > 0
                ? `Income ${currencySymbol}${personalIncome.toFixed(
                    0,
                  )} · Settle ${currencySymbol}${settlementsReceived.toFixed(
                    0,
                  )}`
                : 'Personal Income'}
            </AppText>
          </View>

          {/* Outflow Box */}
          <View style={[styles.flowBox, styles.outflowBox]}>
            <View style={styles.flowHeader}>
              <View style={[styles.flowIconPill, styles.outflowIconPill]}>
                <ArrowUpRight
                  size={13}
                  color={themeColors.debt}
                  strokeWidth={2.4}
                />
              </View>
              <AppText
                style={[styles.flowLabel, { color: themeColors.textSecondary }]}
                numberOfLines={1}
              >
                {'Total Outflow'}
              </AppText>
            </View>

            <AppText
              style={[styles.flowAmount, { color: themeColors.debt }]}
              numberOfLines={1}
            >
              {`-${currencySymbol}${totalOutflow.toFixed(2)}`}
            </AppText>

            <AppText
              style={[styles.flowSubtext, { color: themeColors.textSecondary }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {trackOutOfPocket
                ? groupExpenseOutflow > 0
                  ? `Personal ${currencySymbol}${personalSpend.toFixed(
                      0,
                    )} · Group ${currencySymbol}${groupExpenseOutflow.toFixed(
                      0,
                    )}`
                  : 'Personal Spent'
                : groupSpend > 0
                ? `Personal ${currencySymbol}${personalSpend.toFixed(
                    0,
                  )} · Group ${currencySymbol}${groupSpend.toFixed(0)}`
                : 'Personal Spent'}
            </AppText>
          </View>
        </View>

        {/* Bottom: Final Value (Net Balance) in Smaller Text */}
        <View
          style={[styles.netFooter, { borderTopColor: themeColors.border }]}
        >
          <View style={styles.netLeft}>
            <Scale
              size={14}
              color={themeColors.textSecondary}
              strokeWidth={2}
            />
            <AppText
              style={[styles.netLabel, { color: themeColors.textSecondary }]}
            >
              {'Net Balance'}
            </AppText>
          </View>

          <View style={styles.netRight}>
            <AppText style={[styles.netAmount, { color: netColor }]}>
              {`${netSign}${currencySymbol}${absNet.toFixed(2)}`}
            </AppText>
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: space.sm + 4,
    marginTop: space.xs,
    marginBottom: space.sm,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
  },

  // Flow side-by-side row
  flowRow: {
    flexDirection: 'row',
    gap: space.sm,
    marginBottom: space.sm,
  },
  flowBox: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    borderRadius: radius.lg,
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.sm + 2,
    borderWidth: 1,
  },
  inflowBox: {
    backgroundColor: hexToRgba(colors.credit, 0.06),
    borderColor: hexToRgba(colors.credit, 0.18),
  },
  outflowBox: {
    backgroundColor: hexToRgba(colors.debt, 0.06),
    borderColor: hexToRgba(colors.debt, 0.18),
  },
  flowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  flowIconPill: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inflowIconPill: {
    backgroundColor: colors.creditLight,
  },
  outflowIconPill: {
    backgroundColor: colors.debtLight,
  },
  flowLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  flowAmount: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  flowSubtext: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textSecondary,
  },

  // Bottom Net Footer
  netFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: space.xs + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
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
  netRight: {
    alignItems: 'flex-end',
  },
  netAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
});
