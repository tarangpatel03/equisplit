import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, space, useAppTheme } from '@/theme';
import { PersonalAnalyticsType } from '../hooks/useAnalytics';

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
            isExpense && {
              backgroundColor: themeColors.debtLight,
              borderColor: themeColors.debt,
              borderWidth: 1,
            },
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
              isExpense && {
                color: themeColors.debt,
                fontWeight: '700',
              },
            ]}
          >
            {'Expenses'}
          </AppText>
        </Pressable>

        {/* Income Option */}
        <Pressable
          style={[
            styles.option,
            isIncome && {
              backgroundColor: themeColors.primaryLight,
              borderColor: themeColors.credit,
              borderWidth: 1,
            },
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
              isIncome && {
                color: themeColors.credit,
                fontWeight: '700',
              },
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
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
