import { memo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useCurrency } from '@/hooks';
import { colors, radius, space, useAppTheme } from '@/theme';
import { Member } from '@/types';
import { MemberBalanceDetail } from '@/utils';

type Props = {
  detail: MemberBalanceDetail;
  defaultExpanded?: boolean;
  onSettleUp?: (payer: Member, receiver: Member, amount: number) => void;
};

export const MemberBalanceCard = memo(
  ({ detail, defaultExpanded = false, onSettleUp }: Props) => {
    const { colors: themeColors } = useAppTheme();
    const { currencySymbol } = useCurrency();
    const [expanded, setExpanded] = useState(defaultExpanded);
    const { member, netBalance, status, breakdowns } = detail;

    const absAmount = Math.abs(netBalance);
    const sign = netBalance > 0 ? '+' : netBalance < 0 ? '-' : '';
    const initial = member.name.charAt(0).toUpperCase();

    const isCredit = netBalance > 0.005;
    const isDebt = netBalance < -0.005;

    const amountColor = isCredit
      ? themeColors.credit
      : isDebt
      ? themeColors.debt
      : themeColors.textSecondary;

    const statusLabel =
      status === 'to pay'
        ? 'To Pay'
        : status === 'gets back'
        ? 'Gets Back'
        : 'Settled Up';

    const statusColor = isCredit
      ? themeColors.credit
      : isDebt
      ? themeColors.debt
      : themeColors.textSecondary;

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
        <Pressable
          style={styles.headerPressable}
          onPress={() => setExpanded(prev => !prev)}
          hitSlop={4}
        >
          <View style={styles.left}>
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: themeColors.surfaceAlt,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <AppText
                style={[styles.avatarText, { color: themeColors.textPrimary }]}
              >
                {initial}
              </AppText>
            </View>

            <View style={styles.nameCol}>
              <View style={styles.nameRow}>
                <AppText
                  style={[styles.memberName, { color: themeColors.textPrimary }]}
                  numberOfLines={1}
                >
                  {member.name}
                </AppText>
                {member.isPrimary && (
                  <View
                    style={[
                      styles.youBadge,
                      { backgroundColor: themeColors.primaryLight },
                    ]}
                  >
                    <AppText
                      style={[styles.youBadgeText, { color: themeColors.primary }]}
                    >
                      {'You'}
                    </AppText>
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
              {`${sign}${currencySymbol}${absAmount.toFixed(2)}`}
            </AppText>
            <View
              style={[
                styles.chevronPill,
                { backgroundColor: themeColors.surfaceAlt },
              ]}
            >
              <AppText
                style={[
                  styles.chevronText,
                  { color: themeColors.textSecondary },
                ]}
              >
                {expanded ? '▴' : '▾'}
              </AppText>
            </View>
          </View>
        </Pressable>

        {expanded ? (
          <View
            style={[
              styles.breakdownContainer,
              {
                backgroundColor: themeColors.surfaceAlt,
                borderTopColor: themeColors.border,
              },
            ]}
          >
            <AppText
              style={[
                styles.breakdownTitle,
                { color: themeColors.textSecondary },
              ]}
            >
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
                const itemColor = itemIsCredit
                  ? themeColors.credit
                  : themeColors.debt;

                return (
                  <View
                    key={item.otherMemberId}
                    style={[
                      styles.breakdownRow,
                      { borderBottomColor: themeColors.border },
                    ]}
                  >
                    <View style={styles.breakdownLeft}>
                      <View
                        style={[
                          styles.miniAvatar,
                          {
                            backgroundColor: themeColors.surface,
                            borderColor: themeColors.border,
                          },
                        ]}
                      >
                        <AppText
                          style={[
                            styles.miniAvatarText,
                            { color: themeColors.textPrimary },
                          ]}
                        >
                          {otherInitial}
                        </AppText>
                      </View>
                      <AppText
                        style={[
                          styles.otherName,
                          { color: themeColors.textPrimary },
                        ]}
                        numberOfLines={1}
                      >
                        {item.otherMemberName}
                      </AppText>
                    </View>

                    <View style={styles.breakdownRight}>
                      <AppText
                        style={[styles.breakdownAmount, { color: itemColor }]}
                      >
                        {`${itemSign}${currencySymbol}${itemAbs.toFixed(2)}`}
                      </AppText>
                      {onSettleUp && itemAbs > 0.005 ? (
                        <Pressable
                          style={styles.settleBtn}
                          hitSlop={6}
                          onPress={() => {
                            if (item.amount < 0) {
                              onSettleUp(
                                member,
                                {
                                  id: item.otherMemberId,
                                  name: item.otherMemberName,
                                },
                                itemAbs,
                              );
                            } else {
                              onSettleUp(
                                {
                                  id: item.otherMemberId,
                                  name: item.otherMemberName,
                                },
                                member,
                                itemAbs,
                              );
                            }
                          }}
                        >
                          <AppText style={styles.settleBtnText}>{'Settle'}</AppText>
                        </Pressable>
                      ) : null}
                    </View>
                  </View>
                );
              })
            ) : (
              <AppText
                style={[
                  styles.noBreakdownText,
                  { color: themeColors.textSecondary },
                ]}
              >
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
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: space.md,
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
    lineHeight: 14,
  },
  breakdownContainer: {
    backgroundColor: colors.surfaceAlt,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  breakdownTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: space.xs,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.xs + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 2,
    flex: 1,
  },
  miniAvatar: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  miniAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  otherName: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  breakdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 2,
  },
  breakdownAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  settleBtn: {
    backgroundColor: 'rgba(32, 217, 178, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(32, 217, 178, 0.35)',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: radius.full,
  },
  settleBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  noBreakdownText: {
    fontSize: 12,
    color: colors.textSecondary,
    paddingVertical: space.xs,
    fontStyle: 'italic',
  },
});
