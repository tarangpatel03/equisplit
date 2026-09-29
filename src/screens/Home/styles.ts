import { StyleSheet } from 'react-native';

import { colors, hexToRgba, radius, space } from '@/theme';

export const styles = StyleSheet.create({
  // Expense list
  list: {
    flex: 1,
  },
  listHeader: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
    paddingBottom: space.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  expensesCountBadge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  expensesCountText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: space.md,
    paddingBottom: 100, // space for FAB
  },

  // Empty state
  emptyState: {
    paddingTop: space.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    width: 70,
    height: 70,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: space.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  clearFilterBtn: {
    marginTop: space.md,
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: hexToRgba(colors.primary, 0.35),
    paddingVertical: 6,
    paddingHorizontal: space.md,
    borderRadius: radius.full,
  },
  clearFilterBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },

  // Error state
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 15,
    color: colors.error,
    marginBottom: space.sm,
  },
  retryBtn: {
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
  },
  retryText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
