import { FC } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';
import { Member } from '@/types';

import { styles } from '../styles';

type Props = {
  members: Member[];
  selectedMemberIds: string[];
  totalAmount: number;
  onToggleMember: (memberId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
};

export const EquallySplit: FC<Props> = ({
  members,
  selectedMemberIds,
  totalAmount,
  onToggleMember,
  onSelectAll,
  onDeselectAll,
}) => {
  const { colors: themeColors } = useAppTheme();
  const count = selectedMemberIds.length;
  const sharePerPerson =
    count > 0 && totalAmount > 0 ? (totalAmount / count).toFixed(2) : '0.00';

  const allSelected = members.length > 0 && count === members.length;

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border,
        },
      ]}
    >
      <View style={styles.sectionHeaderRow}>
        <AppText style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
          {'Split Equally'}
        </AppText>
        <Pressable onPress={allSelected ? onDeselectAll : onSelectAll}>
          <AppText style={[styles.payerChipTextActive, { color: themeColors.primary }]}>
            {allSelected ? 'Deselect All' : 'Select All'}
          </AppText>
        </Pressable>
      </View>

      <AppText style={[styles.subText, { color: themeColors.textSecondary }]}>
        {count > 0
          ? `₹${sharePerPerson} / person (${count} of ${members.length} people)`
          : 'Select at least one person'}
      </AppText>

      {members.map(m => {
        const isSelected = selectedMemberIds.includes(m.id);
        return (
          <Pressable
            key={m.id}
            style={[
              styles.equalRow,
              { borderBottomColor: themeColors.divider },
            ]}
            onPress={() => onToggleMember(m.id)}
          >
            <View style={styles.equalInfo}>
              <AppText style={[styles.memberName, { color: themeColors.textPrimary }]}>
                {m.name}
              </AppText>
              {isSelected ? (
                <AppText style={styles.equalShareText}>
                  {`₹${sharePerPerson}`}
                </AppText>
              ) : null}
            </View>

            <View
              style={[
                styles.checkbox,
                { borderColor: themeColors.border },
                isSelected && styles.checkboxChecked,
              ]}
            >
              {isSelected ? (
                <AppText style={styles.checkboxCheckmark}>{'✓'}</AppText>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
