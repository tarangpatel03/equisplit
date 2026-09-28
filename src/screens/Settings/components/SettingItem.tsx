import React, { FC, ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, space, useAppTheme } from '@/theme';

type Props = {
  icon: ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: 'default' | 'primary';
  type?: 'chevron' | 'switch' | 'badge' | 'none';
  switchValue?: boolean;
  onSwitchChange?: (val: boolean) => void;
  onPress?: () => void;
  isDestructive?: boolean;
  showDivider?: boolean;
};

export const SettingItem: FC<Props> = ({
  icon,
  iconBg,
  title,
  subtitle,
  badgeText,
  badgeVariant = 'default',
  type = 'chevron',
  switchValue = false,
  onSwitchChange,
  onPress,
  isDestructive = false,
  showDivider = true,
}) => {
  const { colors: themeColors, isDark } = useAppTheme();

  const effectiveIconBg =
    iconBg ?? (isDestructive ? themeColors.debtLight : themeColors.surfaceAlt);

  const content = (
    <View style={styles.row}>
      {/* Left Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isDestructive
              ? themeColors.debtLight
              : effectiveIconBg,
          },
        ]}
      >
        {icon}
      </View>

      {/* Middle Text */}
      <View style={styles.textContainer}>
        <AppText
          style={[
            styles.title,
            {
              color: isDestructive ? themeColors.debt : themeColors.textPrimary,
            },
          ]}
          numberOfLines={1}
        >
          {title}
        </AppText>
        {subtitle ? (
          <AppText
            style={[styles.subtitle, { color: themeColors.textSecondary }]}
            numberOfLines={2}
          >
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {/* Right Accessory */}
      <View style={styles.accessoryContainer}>
        {type === 'switch' && (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{
              false: isDark ? themeColors.border : '#CBD5E1',
              true: themeColors.primary,
            }}
            thumbColor={themeColors.textOnPrimary}
          />
        )}

        {type === 'badge' && badgeText && (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: themeColors.surfaceAlt,
                borderColor: themeColors.border,
              },
              badgeVariant === 'primary' && {
                backgroundColor: themeColors.primaryLight,
                borderColor: themeColors.primary,
              },
            ]}
          >
            <AppText
              style={[
                styles.badgeText,
                { color: themeColors.textSecondary },
                badgeVariant === 'primary' && { color: themeColors.primary },
              ]}
            >
              {badgeText}
            </AppText>
          </View>
        )}

        {type === 'chevron' && (
          <ChevronRight size={18} color={themeColors.textSecondary} />
        )}
      </View>
    </View>
  );

  return (
    <View>
      {onPress && type !== 'switch' ? (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [
            styles.itemPressable,
            pressed && {
              backgroundColor: isDark
                ? 'rgba(255, 255, 255, 0.04)'
                : 'rgba(0, 0, 0, 0.03)',
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={title}
        >
          {content}
        </Pressable>
      ) : (
        <View style={styles.itemPressable}>{content}</View>
      )}
      {showDivider ? (
        <View
          style={[styles.divider, { backgroundColor: themeColors.border }]}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  itemPressable: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm + 2,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  accessoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: space.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 38 + space.md + space.sm + 2,
  },
});
