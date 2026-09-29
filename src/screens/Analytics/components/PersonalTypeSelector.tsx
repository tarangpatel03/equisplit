import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';
import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, space, useAppTheme } from '@/theme';

import type { PersonalAnalyticsType } from '@/screens/Analytics/hooks/useAnalytics';

type Props = {
  activeType: PersonalAnalyticsType;
  onSelectType: (type: PersonalAnalyticsType) => void;
};

export const PersonalTypeSelector: FC<Props> = ({
  activeType,
  onSelectType,
}) => {
  const { colors: themeColors } = useAppTheme();
  const isExpense = activeType === 'expense';
  const isIncome = activeType === 'income';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.selectorContainer,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
          },
        ]}
      >
        {/* Expenses Option */}
        <Pressable
          style={[
            styles.option,
            isExpense && [
              styles.optionActive,
              {
                backgroundColor: themeColors.debtLight,
                borderColor: themeColors.debt,
              },
            ],
          ]}
          onPress={() => onSelectType('expense')}
          hitSlop={4}
        >
          <ArrowUpRight
            size={15}
            color={isExpense ? themeColors.debt : themeColors.textSecondary}
            strokeWidth={2.4}
          />
          <AppText
            style={[
              styles.optionLabel,
              { color: themeColors.textSecondary },
              isExpense && [
                styles.optionLabelActive,
                { color: themeColors.debt },
              ],
            ]}
          >
            {'Expenses'}
          </AppText>
        </Pressable>

        {/* Income Option */}
        <Pressable
          style={[
            styles.option,
            isIncome && [
              styles.optionActive,
              {
                backgroundColor: themeColors.primaryLight,
                borderColor: themeColors.credit,
              },
            ],
          ]}
          onPress={() => onSelectType('income')}
          hitSlop={4}
        >
          <ArrowDownLeft
            size={15}
            color={isIncome ? themeColors.credit : themeColors.textSecondary}
            strokeWidth={2.4}
          />
          <AppText
            style={[
              styles.optionLabel,
              { color: themeColors.textSecondary },
              isIncome && [
                styles.optionLabelActive,
                { color: themeColors.credit },
              ],
            ]}
          >
            {'Income'}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: space.md,
    marginBottom: space.sm,
  },
  selectorContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: space.sm,
    borderRadius: radius.lg,
    gap: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  optionActive: {
    borderWidth: 1,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  optionLabelActive: {
    fontWeight: '700',
  },
});
