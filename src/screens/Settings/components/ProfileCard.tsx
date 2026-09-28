import React, { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ArrowRightLeft, UserCheck } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, space, useAppTheme } from '@/theme';
import { Member } from '@/types';

type Props = {
  primaryMember?: Member;
  onSwitch: () => void;
};

export const ProfileCard: FC<Props> = ({ primaryMember, onSwitch }) => {
  const { colors: themeColors } = useAppTheme();
  const memberName = primaryMember?.name ?? 'No Primary Member';
  const initial = memberName.charAt(0).toUpperCase();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <AppText style={styles.avatarText}>{initial}</AppText>
        </View>

        {/* Member Details */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <AppText
              style={[styles.name, { color: themeColors.textPrimary }]}
              numberOfLines={1}
            >
              {memberName}
            </AppText>
            <View style={styles.primaryBadge}>
              <UserCheck size={11} color={themeColors.primary} strokeWidth={2.4} />
              <AppText style={styles.primaryBadgeText}>{'You'}</AppText>
            </View>
          </View>
          <AppText
            style={[styles.subtitle, { color: themeColors.textSecondary }]}
          >
            {'Active profile for personal records & split balances'}
          </AppText>
        </View>
      </View>

      {/* Switch Member Action */}
      <View
        style={[styles.bottomBar, { borderTopColor: themeColors.border }]}
      >
        <AppText
          style={[styles.noteText, { color: themeColors.textSecondary }]}
        >
          {'Need to track as another person?'}
        </AppText>
        <Pressable
          style={({ pressed }) => [
            styles.switchBtn,
            pressed && styles.switchBtnPressed,
          ]}
          onPress={onSwitch}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Switch primary member"
        >
          <ArrowRightLeft
            size={13}
            color={themeColors.primary}
            strokeWidth={2.2}
          />
          <AppText style={styles.switchBtnText}>{'Switch'}</AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: space.md,
    marginBottom: space.lg,
    gap: space.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: 'rgba(28, 194, 159, 0.15)',
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(28, 194, 159, 0.3)',
  },
  primaryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  noteText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: space.sm + 2,
    paddingVertical: 5,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: 'rgba(28, 194, 159, 0.35)',
  },
  switchBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  switchBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
});
