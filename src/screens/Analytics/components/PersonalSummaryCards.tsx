import { FC } from "react";
import { StyleSheet, View } from "react-native";
import { ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react-native";

import { AppText } from "@/components/ui/AppText";
import { colors, radius, space } from "@/theme";

type Props = {
  totalInflow: number;
  totalOutflow: number;
  netBalance: number;
};

export const PersonalSummaryCards: FC<Props> = ({
  totalInflow,
  totalOutflow,
  netBalance,
}) => {
  const netSign = netBalance > 0 ? "+" : netBalance < 0 ? "-" : "";
  const absNet = Math.abs(netBalance);
  const netColor =
    netBalance > 0.005
      ? colors.credit
      : netBalance < -0.005
      ? colors.debt
      : colors.textPrimary;

  return (
    <View style={styles.container}>
      {/* Side-by-Side Inflow & Outflow Cards */}
      <View style={styles.cardsRow}>
        {/* Total Inflow Card */}
        <View style={[styles.card, styles.inflowCard]}>
          <View style={styles.headerRow}>
            <View style={[styles.iconPill, styles.inflowIconPill]}>
              <ArrowDownLeft
                size={13}
                color={colors.credit}
                strokeWidth={2.4}
              />
            </View>
            <AppText style={styles.label} numberOfLines={1}>
              {"Total Inflow"}
            </AppText>
          </View>
          <AppText
            style={[styles.amount, { color: colors.credit }]}
            numberOfLines={1}
          >
            {`+₹${totalInflow.toFixed(2)}`}
          </AppText>
        </View>

        {/* Total Outflow Card */}
        <View style={[styles.card, styles.outflowCard]}>
          <View style={styles.headerRow}>
            <View style={[styles.iconPill, styles.outflowIconPill]}>
              <ArrowUpRight
                size={13}
                color={colors.debt}
                strokeWidth={2.4}
              />
            </View>
            <AppText style={styles.label} numberOfLines={1}>
              {"Total Outflow"}
            </AppText>
          </View>
          <AppText
            style={[styles.amount, { color: colors.debt }]}
            numberOfLines={1}
          >
            {`-₹${totalOutflow.toFixed(2)}`}
          </AppText>
        </View>
      </View>

      {/* Net Balance Footer */}
      <View style={styles.netFooter}>
        <View style={styles.netLeft}>
          <Scale size={14} color={colors.textSecondary} strokeWidth={2} />
          <AppText style={styles.netLabel}>{"Net Balance"}</AppText>
        </View>
        <AppText style={[styles.netAmount, { color: netColor }]} numberOfLines={1}>
          {`${netSign}₹${absNet.toFixed(2)}`}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: space.md,
    marginBottom: space.md,
  },
  cardsRow: {
    flexDirection: "row",
    gap: space.sm,
    marginBottom: space.xs + 2,
  },
  card: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.sm + 2,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  inflowCard: {
    backgroundColor: "rgba(32, 217, 178, 0.05)",
    borderColor: "rgba(32, 217, 178, 0.18)",
  },
  outflowCard: {
    backgroundColor: "rgba(255, 107, 107, 0.05)",
    borderColor: "rgba(255, 107, 107, 0.18)",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  iconPill: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    alignItems: "center",
    justifyContent: "center",
  },
  inflowIconPill: {
    backgroundColor: colors.primaryLight,
  },
  outflowIconPill: {
    backgroundColor: colors.debtLight,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 0.2,
  },
  amount: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  netFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    paddingVertical: 7,
    paddingHorizontal: space.sm + 2,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
  },
  netLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  netLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  netAmount: {
    fontSize: 13,
    fontWeight: "700",
  },
});
