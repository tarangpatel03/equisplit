import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useCurrency } from '@/hooks';
import { colors, radius, space, useAppTheme } from '@/theme';

type Props = {
  totalPaid: number;
  totalShare: number;
};

export const AnalyticsSummaryCards: FC<Props> = ({ totalPaid, totalShare }) => {
  const { colors: themeColors } = useAppTheme();
  const { currencySymbol } = useCurrency();

  return (
    <View style={styles.container}>
      {/* Total Paid Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={[styles.arrowBadge, styles.paidBadge]}>
            <AppText style={styles.paidArrow}>{'↑'}</AppText>
          </View>
          <AppText
            style={[styles.label, { color: themeColors.textSecondary }]}
          >
            {'Total Paid'}
          </AppText>
        </View>
        <AppText
          style={[styles.amount, { color: themeColors.textPrimary }]}
          numberOfLines={1}
        >
          {`${currencySymbol}${totalPaid.toFixed(2)}`}
        </AppText>
      </View>

      {/* Total Share Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={[styles.arrowBadge, styles.shareBadge]}>
            <AppText style={styles.shareArrow}>{'↓'}</AppText>
          </View>
          <AppText
            style={[styles.label, { color: themeColors.textSecondary }]}
          >
            {'Total Share'}
          </AppText>
        </View>
        <AppText
          style={[styles.amount, { color: themeColors.textPrimary }]}
          numberOfLines={1}
        >
          {`${currencySymbol}${totalShare.toFixed(2)}`}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: space.md,
    paddingHorizontal: space.md,
    marginBottom: space.lg,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: space.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    marginBottom: space.xs,
  },
  arrowBadge: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidBadge: {
    backgroundColor: colors.settlementLight,
  },
  paidArrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.success,
  },
  shareBadge: {
    backgroundColor: colors.primaryLight,
  },
  shareArrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
