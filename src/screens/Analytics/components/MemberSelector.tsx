import { FC } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { assets } from '@/assets';
import { AppText } from '@/components/ui/AppText';
import { colors, radius, space, useAppTheme } from '@/theme';
import { Member } from '@/types';

type Props = {
  members: Member[];
  selectedMemberId: string;
  onSelectMember: (id: string) => void;
};

export const MemberSelector: FC<Props> = ({
  members,
  selectedMemberId,
  onSelectMember,
}) => {
  const { colors: themeColors } = useAppTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Group View Option */}
        <TouchableOpacity
          style={[
            styles.card,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            },
            selectedMemberId === 'group' && {
              borderColor: themeColors.primary,
              backgroundColor: themeColors.primaryLight,
            },
          ]}
          onPress={() => onSelectMember('group')}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: themeColors.surfaceAlt },
              selectedMemberId === 'group' && {
                backgroundColor: themeColors.primaryLight,
              },
            ]}
          >
            <Image
              source={assets.icons.ic_group}
              style={[
                styles.groupIcon,
                {
                  tintColor:
                    selectedMemberId === 'group'
                      ? themeColors.primary
                      : themeColors.textSecondary,
                },
              ]}
              resizeMode="contain"
            />
          </View>
          <AppText
            style={[
              styles.name,
              { color: themeColors.textPrimary },
              selectedMemberId === 'group' && {
                color: themeColors.primary,
                fontWeight: '700',
              },
            ]}
            numberOfLines={1}
          >
            {'Group View'}
          </AppText>
        </TouchableOpacity>

        {/* Member Cards */}
        {members.map(m => {
          const isSelected = selectedMemberId === m.id;
          const initial = m.name.trim().charAt(0).toUpperCase() || 'M';

          return (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.card,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                },
                isSelected && {
                  borderColor: themeColors.primary,
                  backgroundColor: themeColors.primaryLight,
                },
              ]}
              onPress={() => onSelectMember(m.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: themeColors.surfaceAlt },
                  isSelected && { backgroundColor: themeColors.primaryLight },
                ]}
              >
                <AppText
                  style={[
                    styles.avatarInitial,
                    { color: themeColors.textPrimary },
                    isSelected && { color: themeColors.primary },
                  ]}
                >
                  {initial}
                </AppText>
              </View>
              <AppText
                style={[
                  styles.name,
                  { color: themeColors.textPrimary },
                  isSelected && {
                    color: themeColors.primary,
                    fontWeight: '700',
                  },
                ]}
                numberOfLines={1}
              >
                {m.name}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: space.lg,
  },
  scrollContent: {
    paddingHorizontal: space.md,
    gap: space.sm,
  },
  card: {
    width: 86,
    height: 94,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingVertical: space.sm,
    paddingHorizontal: space.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceAlt,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.xs,
  },
  avatarActive: {
    backgroundColor: colors.primaryLight,
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  avatarInitialActive: {
    color: colors.primary,
  },
  groupIcon: {
    width: 24,
    height: 24,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    width: '100%',
  },
  nameActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
