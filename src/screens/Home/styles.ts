import { StyleSheet } from 'react-native';

import { colors, radius, space } from '@/theme';

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
  manageCategoriesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: space.sm + 4,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },
  manageCategoriesBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  manageCategoriesText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textOnPrimary,
    letterSpacing: 0.2,
  },
  categoriesCountBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    paddingHorizontal: 7,
    paddingVertical: 1.5,
    borderRadius: radius.full,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textOnPrimary,
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
    backgroundColor: 'rgba(32, 217, 178, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(32, 217, 178, 0.35)',
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
