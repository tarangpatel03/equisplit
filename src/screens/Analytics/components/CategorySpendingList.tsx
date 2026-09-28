import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { CategoryIcon } from '@/components/common';
import { AppText } from '@/components/ui/AppText';
import { getCategoryBgColor } from '@/config';
import { colors, radius, space, useAppTheme } from '@/theme';

import { CategorySpending } from '../hooks/useAnalytics';

type Props = {
  data: CategorySpending[];
};

export const CategorySpendingList: FC<Props> = ({ data }) => {
  const { colors: themeColors } = useAppTheme();
  if (data.length === 0) return null;

  return (
    <View style={styles.container}>
      {data.map(item => {
        const bgColor = getCategoryBgColor(item.category.color, 0.16);

        return (
          <View
            key={item.category.id}
            style={[
              styles.card,
              {
                backgroundColor: themeColors.surface,
                borderColor: themeColors.border,
              },
            ]}
          >
            {/* Category Avatar & Name */}
            <View style={styles.left}>
              <View style={[styles.iconContainer, { backgroundColor: bgColor }]}>
                <CategoryIcon
                  iconKey={item.category.iconKey}
                  size={22}
                  color={item.category.color}
                  strokeWidth={2}
                />
              </View>
              <AppText
                style={[
                  styles.categoryName,
                  { color: themeColors.textPrimary },
                ]}
                numberOfLines={1}
              >
                {item.category.name}
              </AppText>
            </View>

            {/* Amount & Percentage */}
            <View style={styles.right}>
              <AppText
                style={[styles.amount, { color: themeColors.textPrimary }]}
                numberOfLines={1}
              >
                {`₹${item.amount.toFixed(2)}`}
              </AppText>
              <AppText
                style={[
                  styles.percentage,
                  { color: themeColors.textSecondary },
                ]}
              >
                {`${item.percentage.toFixed(1)}%`}
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: space.md,
    gap: space.sm,
    marginTop: space.sm,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    marginRight: space.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    flexShrink: 1,
  },
  right: {
    alignItems: 'flex-end',
    gap: 2,
  },
  amount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
