import { FC } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppInput } from '@/components/ui/AppInput';
import { AppText } from '@/components/ui/AppText';
import { Member } from '@/types';

import { styles } from '../styles';

type Props = {
  name: string;
  onChangeName: (val: string) => void;
  members: Member[];
  selectedMemberId: string | null;
  onSelectMember: (member: Member) => void;
  error?: string;
};

export const PrimaryUserSetupSlide: FC<Props> = ({
  name,
  onChangeName,
  members,
  selectedMemberId,
  onSelectMember,
  error,
}) => {
  const initial = name.trim() ? name.trim().charAt(0).toUpperCase() : '?';

  return (
    <View style={styles.setupContainer}>
      <View style={styles.setupCard}>
        <View style={styles.avatarPreview}>
          <AppText style={styles.avatarText}>{initial}</AppText>
        </View>

        <AppText style={styles.setupTitle}>{'Set Up Your Profile'}</AppText>
        <AppText style={styles.setupSubtitle}>
          {
            'Enter your name to mark yourself as "You" for tracking personal expenses & group shares.'
          }
        </AppText>

        {members.length > 0 ? (
          <>
            <AppText style={styles.chipsTitle}>
              {'Or select an existing member:'}
            </AppText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.chipsScroll}
            >
              {members.map(m => {
                const isSelected = m.id === selectedMemberId;
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => onSelectMember(m)}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                  >
                    <AppText
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {m.name}
                    </AppText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </>
        ) : null}

        <AppInput
          label="Your Name"
          placeholder="e.g. Alex"
          value={name}
          onChangeText={onChangeName}
          autoCapitalize="words"
          returnKeyType="done"
          error={error}
        />
      </View>
    </View>
  );
};
