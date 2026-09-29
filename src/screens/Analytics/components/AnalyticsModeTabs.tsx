import { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Users, Wallet } from "lucide-react-native";

import { AppText } from "@/components/ui/AppText";
import { colors, radius, space } from "@/theme";

type Props = {
  activeTab: "personal" | "group";
  onSelectTab: (tab: "personal" | "group") => void;
};

export const AnalyticsModeTabs: FC<Props> = ({ activeTab, onSelectTab }) => {
  const isPersonal = activeTab === "personal";
  const isGroup = activeTab === "group";

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <Pressable
          style={[styles.tab, isPersonal && styles.tabActive]}
          onPress={() => onSelectTab("personal")}
          hitSlop={4}
        >
          <Wallet
            size={16}
            color={isPersonal ? colors.primary : colors.textSecondary}
            strokeWidth={2.2}
          />
          <AppText
            style={[styles.tabLabel, isPersonal && styles.tabLabelActive]}
          >
            {"Personal"}
          </AppText>
        </Pressable>

        <Pressable
          style={[styles.tab, isGroup && styles.tabActive]}
          onPress={() => onSelectTab("group")}
          hitSlop={4}
        >
          <Users
            size={16}
            color={isGroup ? colors.primary : colors.textSecondary}
            strokeWidth={2.2}
          />
          <AppText
            style={[styles.tabLabel, isGroup && styles.tabLabelActive]}
          >
            {"Group Splits"}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: space.md,
    paddingTop: space.xs,
    paddingBottom: space.sm,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 9,
    paddingHorizontal: space.xs,
    borderRadius: radius.lg,
    gap: 6,
  },
  tabActive: {
    backgroundColor: colors.primaryLight,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: "700",
  },
});
