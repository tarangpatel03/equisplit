import { memo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, space } from '@/theme';
import { MemberBalanceDetail } from '@/utils';

type Props = {
  detail: MemberBalanceDetail;
  defaultExpanded?: boolean;
};

export const MemberBalanceCard = memo(
  ({ detail, defaultExpanded = false }: Props) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const { member, netBalance, status, breakdowns } = detail;

    const absAmount = Math.abs(netBalance);
    const sign = netBalance > 0 ? '+' : netBalance < 0 ? '-' : '';
    const initial = member.name.charAt(0).toUpperCase();

    const isCredit = netBalance > 0.005;
    const isDebt = netBalance < -0.005;

    const amountColor = isCredit
      ? colors.credit
      : isDebt
      ? colors.debt
      : colors.textSecondary;

    const statusLabel =
      status === 'to pay'
        ? 'To Pay'
        : status === 'gets back'
        ? 'Gets Back'
        : 'Settled Up';

    const statusColor = isCredit
      ? colors.credit
      : isDebt
      ? colors.debt
      : colors.textSecondary;

    return (
      <View style={styles.card}>
        <Pressable
          style={styles.headerPressable}
          onPress={() => setExpanded(prev => !prev)}
          hitSlop={4}
        >
          <View style={styles.left}>
            <View style={styles.avatar}>
              <AppText style={styles.avatarText}>{initial}</AppText>
            </View>

            <View style={styles.nameCol}>
              <View style={styles.nameRow}>
                <AppText style={styles.memberName} numberOfLines={1}>
                  {member.name}
                </AppText>
                {member.isPrimary && (
                  <View style={styles.youBadge}>
                    <AppText style={styles.youBadgeText}>{'You'}</AppText>
                  </View>
                )}
              </View>
              <AppText style={[styles.statusText, { color: statusColor }]}>
                {statusLabel}
              </AppText>
            </View>
          </View>

          <View style={styles.right}>
            <AppText style={[styles.netAmount, { color: amountColor }]}>
              {`${sign}₹${absAmount.toFixed(2)}`}
            </AppText>
            <View style={styles.chevronPill}>
              <AppText style={styles.chevronText}>
                {expanded ? '▴' : '▾'}
              </AppText>
            </View>
          </View>
        </Pressable>

        {expanded ? (
          <View style={styles.breakdownContainer}>
            <AppText style={styles.breakdownTitle}>
              {'BALANCE BREAKDOWN'}
            </AppText>

            {breakdowns.length > 0 ? (
              breakdowns.map(item => {
                const otherInitial = item.otherMemberName
                  .charAt(0)
                  .toUpperCase();
                const itemIsCredit = item.amount > 0;
                const itemSign = item.amount > 0 ? '+' : '-';
                const itemAbs = Math.abs(item.amount);
                const itemColor = itemIsCredit ? colors.credit : colors.debt;

                return (
                  <View key={item.otherMemberId} style={styles.breakdownRow}>
                    <View style={styles.breakdownLeft}>
                      <View style={styles.miniAvatar}>
                        <AppText style={styles.miniAvatarText}>
                          {otherInitial}
                        </AppText>
                      </View>
                      <AppText style={styles.otherName} numberOfLines={1}>
                        {item.otherMemberName}
                      </AppText>
                    </View>

                    <AppText
                      style={[styles.breakdownAmount, { color: itemColor }]}
                    >
                      {`${itemSign}₹${itemAbs.toFixed(2)}`}
                    </AppText>
                  </View>
                );
              })
            ) : (
              <AppText style={styles.noBreakdownText}>
                {'All balances are settled up.'}
              </AppText>
            )}
          </View>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  nameCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  youBadge: {
    backgroundColor: colors.primaryLight,
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderRadius: radius.full,
  },
  youBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 2,
  },
  netAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  chevronPill: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
    marginTop: -1,
  },

  // Breakdown
  breakdownContainer: {
    marginTop: space.sm + 2,
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  breakdownTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: colors.textSecondary,
    marginBottom: space.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
  },
  miniAvatar: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  otherName: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 1,
  },
  breakdownAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  noBreakdownText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
    paddingVertical: 4,
  },
});
