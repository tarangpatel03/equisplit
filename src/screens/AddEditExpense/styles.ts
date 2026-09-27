import { StyleSheet } from 'react-native';

import { colors, radius, space } from '@/theme';

export const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  scrollContent: {
    padding: space.md,
    paddingBottom: 100,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: space.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.sm,
  },
  subText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: space.sm,
  },

  // Amount prefix
  amountPrefixContainer: {
    marginRight: space.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountPrefixText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },

  // Date selector
  dateContainer: {
    marginBottom: space.sm,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: space.sm,
    height: 48,
  },
  calendarIcon: {
    width: 22,
    height: 22,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },

  // Title Row with Category Icon Button on Left
  titleSection: {
    marginBottom: space.sm,
  },
  titleLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: 4,
    marginLeft: 48 + space.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
  },
  titleCategoryBtn: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCategoryBtnPressed: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
  },
  titleCategoryIcon: {
    width: 32,
    height: 32,
  },
  titleInputFlex: {
    flex: 1,
  },
  titleInputContainer: {
    marginBottom: 0,
  },

  // Category Selector
  categoryContainer: {
    marginBottom: space.md,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: space.xs,
  },
  categoryScroll: {
    paddingVertical: 2,
    gap: space.xs,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.sm,
    paddingVertical: space.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: space.xs,
    gap: 6,
  },
  categoryChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  categoryIconImg: {
    width: 16,
    height: 16,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    fontWeight: '600',
    color: colors.primary,
  },

  // Payers Quick Chips
  chipScroll: {
    flexDirection: 'row',
    gap: space.xs,
    paddingBottom: space.xs,
    marginBottom: space.sm,
  },
  payerChip: {
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  payerChipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  payerChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  payerChipTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Member Rows (for Payers, Shares, Amount)
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  memberName: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },
  memberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  currencyPrefix: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 6,
  },
  numberInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.xs,
    paddingVertical: 0,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceAlt,
    paddingRight: space.sm + 4,
    textAlign: 'right',
    textAlignVertical: 'center',
  },

  // Status indicator
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: space.sm,
    paddingTop: space.xs,
  },
  statusTextSuccess: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
  },
  statusTextError: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
  },

  // Split Mode Segmented Control
  modeContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: 3,
    marginBottom: space.md,
  },
  modeTab: {
    flex: 1,
    paddingVertical: space.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  modeTabActive: {
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  modeTabTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },

  // Equally Split
  equalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  equalInfo: {
    flex: 1,
  },
  equalShareText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: space.sm,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxCheckmark: {
    color: colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },

  // Shares Split
  sharesInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 20,
    textAlign: 'center',
  },
  sharesInput: {
    minWidth: 56,
    height: 40,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    paddingVertical: 0,
    paddingHorizontal: space.xs,
  },
  computedShareBadge: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: space.xs,
    minWidth: 72,
    textAlign: 'right',
  },

  // Per Item Split
  itemCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: space.sm,
    marginBottom: space.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginBottom: space.xs,
  },
  itemNameInput: {
    flex: 1,
    height: 38,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: space.sm,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  itemCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 104,
    height: 38,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: space.xs,
  },
  itemCostPrefix: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginHorizontal: 2,
  },
  itemCostInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingRight: space.xs,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  itemDeleteBtn: {
    width: 32,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemDeleteText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: '700',
  },
  assigneeLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  assigneeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  assigneeChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  assigneeChipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  assigneeChipText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  assigneeChipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
    marginTop: space.xs,
  },
  addItemBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },

  // Per Item Summary breakdown
  itemSummaryContainer: {
    marginTop: space.sm,
  },
  itemSummaryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: space.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  itemSummaryName: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  itemSummaryAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  // Bottom action bar
  bottomBar: {
    padding: space.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  // Empty members state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xl,
  },
  emptyIcon: {
    width: 50,
    height: 50,
    tintColor: '#FFF',
    marginBottom: space.sm,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: space.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: space.lg,
  },
});
