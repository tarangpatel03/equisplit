import { FC } from 'react';
import { Image, View } from 'react-native';

import { assets } from '@/assets';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';

import { AnalyticsModeTabs } from './components/AnalyticsModeTabs';
import { AnalyticsSummaryCards } from './components/AnalyticsSummaryCards';
import { CategorySpendingList } from './components/CategorySpendingList';
import { DonutChart } from './components/DonutChart';
import { MemberSelector } from './components/MemberSelector';
import { PersonalSummaryCards } from './components/PersonalSummaryCards';
import { PersonalTypeSelector } from './components/PersonalTypeSelector';
import { TimePeriodSelector } from './components/TimePeriodSelector';
import { useAnalytics } from './hooks/useAnalytics';
import { styles } from './styles';

export const AnalyticsScreen: FC = () => {
  const { colors: themeColors } = useAppTheme();

  const {
    activeTab,
    setActiveTab,
    personalType,
    setPersonalType,
    selectedPeriod,
    setSelectedPeriod,
    personalAnalytics,
    members,
    selectedMemberId,
    setSelectedMemberId,
    selectedMemberName,
    totalPaid,
    totalShare,
    totalSpending,
    categoryBreakdown,
    hasGroupExpenses,
  } = useAnalytics();

  const isPersonal = activeTab === 'personal';
  const isIncome = personalType === 'income';

  const personalBreakdown = isIncome
    ? personalAnalytics.incomeBreakdown
    : personalAnalytics.categoryBreakdown;
  const personalTotal = isIncome
    ? personalAnalytics.totalIncome
    : personalAnalytics.totalSpending;
  const hasPersonalData = isIncome
    ? personalAnalytics.hasIncome
    : personalAnalytics.hasExpenses;

  return (
    <AppScreen
      screenTitle="Insights & Analytics"
      showBackButton={false}
      preset="scroll"
      dismissKeyboardOnTouch={false}
      keyboardAvoiding={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Top Segmented Tab Switcher: Personal vs Group Splits */}
      <AnalyticsModeTabs
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {isPersonal ? (
        <>
          {/* Time Period Filter: This Month / Last Month / All Time */}
          <TimePeriodSelector
            selectedPeriod={selectedPeriod}
            onSelectPeriod={setSelectedPeriod}
          />

          {/* Inflow, Outflow, and Net Balance Summary Cards */}
          <PersonalSummaryCards
            totalInflow={personalAnalytics.totalInflow}
            totalOutflow={personalAnalytics.totalOutflow}
            netBalance={personalAnalytics.netBalance}
            activeType={personalType}
            onSelectType={setPersonalType}
          />

          {/* Type Selector: Expenses vs Income */}
          <PersonalTypeSelector
            activeType={personalType}
            onSelectType={setPersonalType}
          />

          {!hasPersonalData ? (
            <View style={styles.emptyContainer}>
              <Image
                source={assets.icons.ic_analysis}
                style={styles.emptyIcon}
                resizeMode="contain"
              />
              <AppText
                style={[styles.emptyTitle, { color: themeColors.textPrimary }]}
              >
                {isIncome
                  ? 'No Income in this Period'
                  : 'No Expenses in this Period'}
              </AppText>
              <AppText
                style={[
                  styles.emptySubtitle,
                  { color: themeColors.textSecondary },
                ]}
              >
                {isIncome
                  ? 'Add income or record received settlements on the Dashboard to see your income breakdown.'
                  : 'Add personal expenses on the Dashboard to see your category breakdown and insights.'}
              </AppText>
            </View>
          ) : (
            <>
              {/* Category Donut Chart */}
              <View
                style={[
                  styles.chartCard,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <View style={styles.chartHeader}>
                  <Image
                    source={assets.icons.ic_analytics_fill}
                    style={styles.chartHeaderIcon}
                    resizeMode="contain"
                  />
                  <AppText
                    style={[
                      styles.chartTitle,
                      { color: themeColors.textPrimary },
                    ]}
                  >
                    {isIncome ? 'Income by Category' : 'Expense Breakdown'}
                  </AppText>
                </View>

                <DonutChart
                  data={personalBreakdown}
                  totalSpending={personalTotal}
                  totalLabel={isIncome ? 'Total Income' : 'Total Spending'}
                  totalColor={isIncome ? themeColors.credit : themeColors.textPrimary}
                />
              </View>

              {/* Category Spending / Income List Cards */}
              {personalBreakdown.length > 0 ? (
                <View style={styles.sectionTitleRow}>
                  <AppText
                    style={[
                      styles.sectionTitle,
                      { color: themeColors.textPrimary },
                    ]}
                  >
                    {isIncome ? 'Top Income Sources' : 'Top Spending Categories'}
                  </AppText>
                </View>
              ) : null}

              <CategorySpendingList
                data={personalBreakdown}
                isIncome={isIncome}
              />
            </>
          )}
        </>
      ) : (
        <>
          {/* Horizontal Member Selector for Group Splits */}
          {members.length > 0 ? (
            <MemberSelector
              members={members}
              selectedMemberId={selectedMemberId}
              onSelectMember={setSelectedMemberId}
            />
          ) : null}

          {/* Group Total Paid & Total Share Summary Cards */}
          <AnalyticsSummaryCards
            totalPaid={totalPaid}
            totalShare={totalShare}
          />

          {!hasGroupExpenses ? (
            <View style={styles.emptyContainer}>
              <Image
                source={assets.icons.ic_analysis}
                style={styles.emptyIcon}
                resizeMode="contain"
              />
              <AppText
                style={[styles.emptyTitle, { color: themeColors.textPrimary }]}
              >
                {'No Expenses Yet'}
              </AppText>
              <AppText
                style={[
                  styles.emptySubtitle,
                  { color: themeColors.textSecondary },
                ]}
              >
                {
                  'Add group expenses on the Dashboard to see real-time category spending analytics.'
                }
              </AppText>
            </View>
          ) : (
            <>
              {/* Donut Chart Card */}
              <View
                style={[
                  styles.chartCard,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.border,
                  },
                ]}
              >
                <View style={styles.chartHeader}>
                  <Image
                    source={assets.icons.ic_analytics_fill}
                    style={styles.chartHeaderIcon}
                    resizeMode="contain"
                  />
                  <AppText
                    style={[
                      styles.chartTitle,
                      { color: themeColors.textPrimary },
                    ]}
                  >
                    {'Category Analysis'}
                  </AppText>
                </View>

                <DonutChart
                  data={categoryBreakdown}
                  totalSpending={totalSpending}
                />
              </View>

              {/* Category Breakdown Header */}
              {categoryBreakdown.length > 0 ? (
                <View style={styles.sectionTitleRow}>
                  <AppText
                    style={[
                      styles.sectionTitle,
                      { color: themeColors.textPrimary },
                    ]}
                  >
                    {`Top Categories — ${selectedMemberName}`}
                  </AppText>
                </View>
              ) : null}

              <CategorySpendingList data={categoryBreakdown} />
            </>
          )}
        </>
      )}
    </AppScreen>
  );
};
