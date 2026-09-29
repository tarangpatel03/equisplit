import { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { AppText } from "@/components/ui/AppText";
import { colors, radius, space } from "@/theme";
import { TimePeriod } from "@/utils/personalAnalytics";

type Props = {
  selectedPeriod: TimePeriod;
  onSelectPeriod: (period: TimePeriod) => void;
};

const PERIODS: { key: TimePeriod; label: string }[] = [
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "all", label: "All Time" },
];

export const TimePeriodSelector: FC<Props> = ({
  selectedPeriod,
  onSelectPeriod,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.pillContainer}>
        {PERIODS.map(period => {
          const isActive = selectedPeriod === period.key;
          return (
            <Pressable
              key={period.key}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => onSelectPeriod(period.key)}
              hitSlop={4}
            >
              <AppText
                style={[styles.pillText, isActive && styles.pillTextActive]}
              >
                {period.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: space.md,
    marginBottom: space.sm,
  },
  pillContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  pill: {
    flex: 1,
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.lg,
  },
  pillActive: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
});
