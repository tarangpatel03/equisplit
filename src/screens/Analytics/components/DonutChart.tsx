import { FC, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme';

import { CategorySpending } from '../hooks/useAnalytics';

type Props = {
  data: CategorySpending[];
  totalSpending: number;
  radius?: number;
  innerRadius?: number;
};

export const DonutChart: FC<Props> = ({
  data,
  totalSpending,
  radius = 115,
  innerRadius = 72,
}) => {
  const chartData = useMemo(() => {
    if (totalSpending <= 0 || data.length === 0) {
      return [{ value: 1, color: colors.surfaceAlt }];
    }

    return data.map(item => ({
      value: item.amount,
      color: item.category.color,
      text: item.percentage >= 5 ? `${Math.round(item.percentage)}%` : '',
      textColor: '#FFFFFF',
      textSize: 10,
      fontWeight: '700',
    }));
  }, [data, totalSpending]);

  return (
    <View style={styles.container}>
      <PieChart
        donut
        data={chartData}
        radius={radius}
        innerRadius={innerRadius}
        strokeWidth={data.length > 1 ? 2.5 : 0}
        strokeColor={colors.background}
        innerCircleColor={colors.background}
        centerLabelComponent={() => (
          <View style={styles.centerContainer}>
            <AppText style={styles.totalAmount} numberOfLines={1}>
              {`₹${totalSpending.toFixed(2)}`}
            </AppText>
            <AppText style={styles.totalLabel}>{'Total'}</AppText>
          </View>
        )}
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
