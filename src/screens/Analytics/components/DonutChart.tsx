import { FC, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import { AppText } from '@/components/ui/AppText';
import { useCurrency } from '@/hooks';
import { colors, useAppTheme } from '@/theme';

import type { CategorySpending } from '@/screens/Analytics/hooks/useAnalytics';

type Props = {
  data: CategorySpending[];
  totalSpending: number;
  radius?: number;
  innerRadius?: number;
  totalLabel?: string;
  totalColor?: string;
};

export const DonutChart: FC<Props> = ({
  data,
  totalSpending,
  radius = 115,
  innerRadius = 72,
  totalLabel = 'Total',
  totalColor,
}) => {
  const { colors: themeColors } = useAppTheme();
  const { currencySymbol } = useCurrency();

  const chartData = useMemo(() => {
    if (totalSpending <= 0 || data.length === 0) {
      return [{ value: 1, color: themeColors.surfaceAlt }];
    }

    return data.map(item => ({
      value: item.amount,
      color: item.category.color,
      text: item.percentage >= 5 ? `${Math.round(item.percentage)}%` : '',
      textColor: themeColors.white,
      textSize: 10,
      fontWeight: '700',
    }));
  }, [data, totalSpending, themeColors]);

  const resolvedAmountColor = totalColor ?? themeColors.textPrimary;

  const renderChart = () => (
    <View style={styles.centerContainer}>
      <AppText
        style={[styles.totalAmount, { color: resolvedAmountColor }]}
        numberOfLines={1}
      >
        {`${currencySymbol}${totalSpending.toFixed(2)}`}
      </AppText>
      <AppText
        style={[styles.totalLabel, { color: themeColors.textSecondary }]}
      >
        {totalLabel}
      </AppText>
    </View>
  );

  return (
    <View style={styles.container}>
      <PieChart
        donut
        data={chartData}
        radius={radius}
        innerRadius={innerRadius}
        strokeWidth={data.length > 1 ? 2.5 : 0}
        strokeColor={themeColors.surface}
        innerCircleColor={themeColors.surface}
        centerLabelComponent={renderChart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 2,
  },
});
