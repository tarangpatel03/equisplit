import { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Users, Wallet } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, space, useAppTheme } from '@/theme';

type Props = {
  activeTab: 'personal' | 'group';
  personalCount: number;
  groupCount: number;
  onSelectTab: (tab: 'personal' | 'group') => void;
};

export const DashboardTypeTabs: FC<Props> = ({
  activeTab,
  personalCount,
  groupCount,
  onSelectTab,
}) => {
  const { colors: themeColors } = useAppTheme();
  const isPersonal = activeTab === 'personal';
  const isGroup = activeTab === 'group';

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tabBar,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
          },
        ]}
      >
        <Pressable
          style={[
            styles.tab,
            isPersonal && { backgroundColor: themeColors.primaryLight },
          ]}
          onPress={() => onSelectTab('personal')}
          hitSlop={4}
        >
          <Wallet
            size={16}
            color={isPersonal ? themeColors.primary : themeColors.textSecondary}
            strokeWidth={2.2}
          />
          <AppText
            style={[
              styles.tabLabel,
              { color: themeColors.textSecondary },
              isPersonal && { color: themeColors.primary, fontWeight: '700' },
            ]}
          >
            {'Personal'}
          </AppText>
          {personalCount > 0 && (
            <View
              style={[
                styles.countBadge,
                { backgroundColor: themeColors.surfaceAlt },
                isPersonal && { backgroundColor: themeColors.primary },
              ]}
            >
              <AppText
                style={[
                  styles.countText,
                  { color: themeColors.textSecondary },
                  isPersonal && { color: themeColors.textOnPrimary },
                ]}
              >
                {personalCount}
              </AppText>
            </View>
          )}
        </Pressable>

        <Pressable
          style={[
            styles.tab,
            isGroup && { backgroundColor: themeColors.primaryLight },
          ]}
          onPress={() => onSelectTab('group')}
          hitSlop={4}
        >
          <Users
            size={16}
            color={isGroup ? themeColors.primary : themeColors.textSecondary}
            strokeWidth={2.2}
          />
          <AppText
            style={[
              styles.tabLabel,
              { color: themeColors.textSecondary },
              isGroup && { color: themeColors.primary, fontWeight: '700' },
            ]}
          >
            {'Group Splits'}
          </AppText>
          {groupCount > 0 && (
            <View
              style={[
                styles.countBadge,
                { backgroundColor: themeColors.surfaceAlt },
                isGroup && { backgroundColor: themeColors.primary },
              ]}
            >
              <AppText
                style={[
                  styles.countText,
                  { color: themeColors.textSecondary },
                  isGroup && { color: themeColors.textOnPrimary },
                ]}
              >
                {groupCount}
              </AppText>
            </View>
          )}
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
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: space.xs,
    borderRadius: radius.lg,
    gap: 6,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
});
