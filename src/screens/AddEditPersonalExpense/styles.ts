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

  // Type Switcher (Expense vs Income)
  typeSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: space.md,
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radius.lg,
    gap: 6,
  },
  typeTabExpenseActive: {
    backgroundColor: colors.debtLight,
  },
  typeTabIncomeActive: {
    backgroundColor: colors.primaryLight,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  typeLabelExpenseActive: {
    color: colors.debt,
    fontWeight: '700',
  },
  typeLabelIncomeActive: {
    color: colors.credit,
    fontWeight: '700',
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
  titleInputFlex: {
    flex: 1,
  },
  titleInputContainer: {
    marginBottom: 0,
  },

  // Note
  noteContainer: {
    marginBottom: space.sm,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: space.sm,
  },

  // Bottom Bar
  bottomBar: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
