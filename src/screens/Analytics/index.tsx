import { FC } from 'react';
import { Image, View } from 'react-native';

import { assets } from '@/assets';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';

import { AnalyticsSummaryCards } from './components/AnalyticsSummaryCards';
import { CategorySpendingList } from './components/CategorySpendingList';
import { DonutChart } from './components/DonutChart';
import { MemberSelector } from './components/MemberSelector';
import { useAnalytics } from './hooks/useAnalytics';
import { styles } from './styles';

export const AnalyticsScreen: FC = () => {
  const {
    members,
    selectedMemberId,
    setSelectedMemberId,
    selectedMemberName,
    totalPaid,
    totalShare,
    totalSpending,
    categoryBreakdown,
    hasExpenses,
  } = useAnalytics();

  return (
    <AppScreen
      screenTitle="Category Analysis"
      preset="scroll"
      dismissKeyboardOnTouch={false}
      keyboardAvoiding={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Horizontal Member Selector */}
      {members.length > 0 ? (
        <MemberSelector
          members={members}
          selectedMemberId={selectedMemberId}
          onSelectMember={setSelectedMemberId}
        />
      ) : null}

      {/* Total Paid & Total Share Summary Cards */}
      <AnalyticsSummaryCards totalPaid={totalPaid} totalShare={totalShare} />

      {!hasExpenses ? (
        <View style={styles.emptyContainer}>
          <Image
            source={assets.icons.ic_analysis}
            style={styles.emptyIcon}
            resizeMode="contain"
          />
          <AppText style={styles.emptyTitle}>{'No Expenses Yet'}</AppText>
          <AppText style={styles.emptySubtitle}>
            {
              'Add group expenses on the Dashboard to see real-time category spending analytics.'
            }
          </AppText>
        </View>
      ) : (
        <>
          {/* Donut Chart Card */}
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Image
                source={assets.icons.ic_analytics_fill}
                style={styles.chartHeaderIcon}
                resizeMode="contain"
              />
              <AppText style={styles.chartTitle}>{'Category Analysis'}</AppText>
            </View>

            <DonutChart
              data={categoryBreakdown}
              totalSpending={totalSpending}
            />
          </View>

          {/* Category Breakdown Header */}
          {categoryBreakdown.length > 0 ? (
            <View style={styles.sectionTitleRow}>
              <AppText style={styles.sectionTitle}>
                {`Top Categories — ${selectedMemberName}`}
              </AppText>
            </View>
          ) : null}

          {/* Category Spending List Cards */}
          <CategorySpendingList data={categoryBreakdown} />
        </>
      )}
    </AppScreen>
  );
};
