import { StyleSheet } from 'react-native';

import { colors, radius, space } from '@/theme';

export const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  scrollContent: {
    padding: space.md,
    paddingBottom: space.xl,
  },

  // Hero / Summary card
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeroAvatar: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  categoryHeroIcon: {
    width: 28,
    height: 28,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: space.xs,
  },
  heroAmount: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: space.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginBottom: space.sm,
  },
  calendarIcon: {
    width: 16,
    height: 16,
  },
  heroDate: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  categoryPill: {
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  badgePill: {
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
  },
  badgePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },

  // Section card
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.xs + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rowName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    flex: 1,
  },
  rowAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  rowSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },

  // Per Item detail
  itemCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: space.sm,
    marginBottom: space.xs,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  itemCost: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemAssignees: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  // Actions
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: space.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: space.md,
  },
  actionBtnWrapper: {
    flex: 1,
  },

  // Empty / Not found
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xl,
  },
  emptyIcon: {
    width: 50,
    height: 50,
    marginBottom: space.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: space.sm,
  },
});
