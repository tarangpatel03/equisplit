import { FC, useMemo } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme';
import { Member } from '@/types';

import { styles } from '../styles';

type Props = {
  members: Member[];
  memberShares: Record<string, string>;
  totalAmount: number;
  onShareChange: (memberId: string, shares: string) => void;
  onStepperChange: (memberId: string, delta: number) => void;
};

export const SharesSplit: FC<Props> = ({
  members,
  memberShares,
  totalAmount,
  onShareChange,
  onStepperChange,
}) => {
  const totalShares = useMemo(() => {
    return members.reduce((sum, m) => {
      const val = parseFloat(memberShares[m.id] ?? '0');
      return sum + (isNaN(val) || val < 0 ? 0 : val);
    }, 0);
  }, [members, memberShares]);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <AppText style={styles.sectionTitle}>{'Split by Shares'}</AppText>
        <AppText style={styles.payerChipTextActive}>
          {`Total Shares: ${totalShares}`}
        </AppText>
      </View>

      <AppText style={styles.subText}>
        {'Enter shares per person. Cost is split proportionally:'}
      </AppText>

      {members.map(m => {
        const raw = parseFloat(memberShares[m.id] ?? '0') || 0;
        const computedAmount =
          totalShares > 0 && totalAmount > 0
            ? ((raw / totalShares) * totalAmount).toFixed(2)
            : '0.00';

        return (
          <View key={m.id} style={styles.memberRow}>
            <AppText style={styles.memberName}>{m.name}</AppText>

            <View style={styles.sharesInputRow}>
              <Pressable
                style={styles.stepperBtn}
                onPress={() => onStepperChange(m.id, -1)}
              >
                <AppText style={styles.stepperBtnText}>{'-'}</AppText>
              </Pressable>

              <TextInput
                style={styles.sharesInput}
                keyboardType="numeric"
                value={memberShares[m.id] || '0'}
                onChangeText={val => onShareChange(m.id, val)}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
              />

              <Pressable
                style={styles.stepperBtn}
                onPress={() => onStepperChange(m.id, 1)}
              >
                <AppText style={styles.stepperBtnText}>{'+'}</AppText>
              </Pressable>

              <AppText style={styles.computedShareBadge}>
                {`₹${computedAmount}`}
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );
};
