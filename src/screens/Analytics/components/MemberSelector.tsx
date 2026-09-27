import { FC } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { assets } from '@/assets';
import { AppText } from '@/components/ui/AppText';
import { colors, radius, space } from '@/theme';
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
            selectedMemberId === 'group' && styles.cardActive,
          ]}
          onPress={() => onSelectMember('group')}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.avatar,
              selectedMemberId === 'group' && styles.avatarActive,
            ]}
          >
            <Image
              source={assets.icons.ic_group}
              style={[
                styles.groupIcon,
                {
                  tintColor:
                    selectedMemberId === 'group'
                      ? colors.primary
                      : colors.textSecondary,
                },
              ]}
              resizeMode="contain"
            />
          </View>
          <AppText
            style={[
              styles.name,
              selectedMemberId === 'group' && styles.nameActive,
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
              style={[styles.card, isSelected && styles.cardActive]}
              onPress={() => onSelectMember(m.id)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.avatar,
                  isSelected && styles.avatarActive,
                ]}
              >
                <AppText
                  style={[
                    styles.avatarInitial,
                    isSelected && styles.avatarInitialActive,
                  ]}
                >
                  {initial}
                </AppText>
              </View>
              <AppText
                style={[styles.name, isSelected && styles.nameActive]}
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
    marginBottom: space.md,
  },
  scrollContent: {
    paddingHorizontal: space.md,
    gap: space.sm,
  },
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    minWidth: 80,
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
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  groupIcon: {
    width: 22,
    height: 22,
  },
  avatarInitial: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  avatarInitialActive: {
    color: colors.primary,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },
  nameActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
