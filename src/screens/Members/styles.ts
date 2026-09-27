import { StyleSheet } from 'react-native';

import { colors, radius, space } from '@/theme';

export const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // ---------------------------------------------------------------------------
  // Top — Group Balance
  // ---------------------------------------------------------------------------
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    paddingBottom: space.xs,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  countBadge: {
    paddingHorizontal: space.xs + 2,
    paddingVertical: 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  balanceScroll: {
    flexGrow: 0,
  },
  balanceRow: {
    paddingHorizontal: space.md,
    paddingVertical: 4,
    gap: space.xs,
  },
  noMembersCard: {
    marginHorizontal: space.md,
    marginVertical: 4,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
  },
  noMembersText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },

  // ---------------------------------------------------------------------------
  // Middle — Member Management
  // ---------------------------------------------------------------------------
  manageCard: {
    marginHorizontal: space.md,
    marginTop: space.sm,
    marginBottom: space.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  addMemberRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    marginBottom: space.sm,
  },
  addInput: {
    flex: 1,
    marginBottom: 0,
  },
  addBtn: {
    marginTop: 2,
    minHeight: 46,
    paddingHorizontal: space.md,
  },
  membersList: {
    marginTop: space.xs,
    gap: space.xs,
  },
  memberChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceAlt,
    paddingVertical: 6,
    paddingHorizontal: space.sm,
    borderRadius: radius.md,
  },
  memberChipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
  },
  chipAvatar: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipAvatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  memberChipName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  deleteMemberBtn: {
    padding: 4,
  },
  deleteIcon: {
    width: 16,
    height: 16,
  },

  // ---------------------------------------------------------------------------
  // Bottom — Member Balances (Reference Design)
  // ---------------------------------------------------------------------------
  balancesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.md,
    marginTop: space.xs,
    marginBottom: 4,
  },
  balancesTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  walletIcon: {
    width: 20,
    height: 20,
  },
  balancesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  currencyPill: {
    paddingHorizontal: space.xs + 4,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  currencyPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  statusSummaryRow: {
    paddingHorizontal: space.md,
    marginBottom: space.sm,
  },
  statusSummaryText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  cardsContainer: {
    paddingHorizontal: space.md,
  },
  emptyBalancesCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyBalancesText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
