import { FC } from "react";
import { Image, View } from "react-native";

import { assets } from "@/assets";
import { AppScreen } from "@/components/ui/AppScreen";
import { AppText } from "@/components/ui/AppText";

import { AnalyticsModeTabs } from "./components/AnalyticsModeTabs";
import { AnalyticsSummaryCards } from "./components/AnalyticsSummaryCards";
import { CategorySpendingList } from "./components/CategorySpendingList";
import { DonutChart } from "./components/DonutChart";
import { MemberSelector } from "./components/MemberSelector";
import { PersonalSummaryCards } from "./components/PersonalSummaryCards";
import { TimePeriodSelector } from "./components/TimePeriodSelector";
import { useAnalytics } from "./hooks/useAnalytics";
import { styles } from "./styles";

export const AnalyticsScreen: FC = () => {
  const {
    activeTab,
    setActiveTab,
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

  const isPersonal = activeTab === "personal";

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
          />

          {!personalAnalytics.hasExpenses ? (
            <View style={styles.emptyContainer}>
              <Image
                source={assets.icons.ic_analysis}
                style={styles.emptyIcon}
                resizeMode="contain"
              />
              <AppText style={styles.emptyTitle}>
                {"No Expenses in this Period"}
              </AppText>
              <AppText style={styles.emptySubtitle}>
                {
                  "Add personal expenses on the Dashboard to see your category breakdown and insights."
                }
              </AppText>
            </View>
          ) : (
            <>
              {/* Category Donut Chart */}
              <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Image
                    source={assets.icons.ic_analytics_fill}
                    style={styles.chartHeaderIcon}
                    resizeMode="contain"
                  />
                  <AppText style={styles.chartTitle}>
                    {"Category Breakdown"}
                  </AppText>
                </View>

                <DonutChart
                  data={personalAnalytics.categoryBreakdown}
                  totalSpending={personalAnalytics.totalSpending}
                />
              </View>

              {/* Category Spending List Cards */}
              {personalAnalytics.categoryBreakdown.length > 0 ? (
                <View style={styles.sectionTitleRow}>
                  <AppText style={styles.sectionTitle}>
                    {"Top Spending Categories"}
                  </AppText>
                </View>
              ) : null}

              <CategorySpendingList
                data={personalAnalytics.categoryBreakdown}
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
              <AppText style={styles.emptyTitle}>{"No Expenses Yet"}</AppText>
              <AppText style={styles.emptySubtitle}>
                {
                  "Add group expenses on the Dashboard to see real-time category spending analytics."
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
                  <AppText style={styles.chartTitle}>
                    {"Category Analysis"}
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
                  <AppText style={styles.sectionTitle}>
                    {`Top Categories — ${selectedMemberName}`}
                  </AppText>
                </View>
              ) : null}

              {/* Category Spending List Cards */}
              <CategorySpendingList data={categoryBreakdown} />
            </>
          )}
        </>
      )}
    </AppScreen>
  );
};
