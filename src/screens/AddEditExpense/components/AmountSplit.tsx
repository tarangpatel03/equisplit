import { FC, useMemo } from 'react';
import { TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useAppTheme } from '@/theme';
import { Member } from '@/types';

import { styles } from '../styles';

type Props = {
  members: Member[];
  memberAmounts: Record<string, string>;
  totalAmount: number;
  onAmountChange: (memberId: string, val: string) => void;
};

export const AmountSplit: FC<Props> = ({
  members,
  memberAmounts,
  totalAmount,
  onAmountChange,
}) => {
  const { colors: themeColors } = useAppTheme();
  const sumAllocated = useMemo(() => {
    return members.reduce((sum, m) => {
      const val = parseFloat(memberAmounts[m.id] ?? '0');
      return sum + (isNaN(val) ? 0 : val);
    }, 0);
  }, [members, memberAmounts]);

  const isMatched =
    totalAmount > 0 && Math.abs(sumAllocated - totalAmount) < 0.01;
  const diff = totalAmount - sumAllocated;

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
          {'Split by Exact Amount'}
        </AppText>
      </View>

      <AppText style={[styles.subText, { color: themeColors.textSecondary }]}>
        {'Enter exact amounts owed by each person:'}
      </AppText>

      {members.map(m => (
        <View
          key={m.id}
          style={[styles.memberRow, { borderBottomColor: themeColors.divider }]}
        >
          <AppText style={[styles.memberName, { color: themeColors.textPrimary }]}>
            {m.name}
          </AppText>
          <View style={styles.memberInputContainer}>
            <AppText style={[styles.currencyPrefix, { color: themeColors.textSecondary }]}>
              {'₹'}
            </AppText>
            <TextInput
              style={[
                styles.numberInput,
                {
                  backgroundColor: themeColors.surfaceAlt,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary,
                },
              ]}
              keyboardType="decimal-pad"
              value={memberAmounts[m.id] ?? ''}
              onChangeText={val => onAmountChange(m.id, val)}
              placeholder="0.00"
              placeholderTextColor={themeColors.textSecondary}
            />
          </View>
        </View>
      ))}

      {/* Status indicator */}
      <View style={styles.statusRow}>
        <AppText
          style={isMatched ? styles.statusTextSuccess : styles.statusTextError}
        >
          {isMatched
            ? `✓ Allocated ₹${sumAllocated.toFixed(2)} of ₹${totalAmount.toFixed(2)}`
            : totalAmount <= 0
            ? 'Enter a valid total amount above'
            : diff > 0
            ? `Allocated ₹${sumAllocated.toFixed(2)} / ₹${totalAmount.toFixed(2)} (₹${diff.toFixed(2)} remaining)`
            : `Allocated ₹${sumAllocated.toFixed(2)} / ₹${totalAmount.toFixed(2)} (₹${Math.abs(diff).toFixed(2)} over)`}
        </AppText>
      </View>
    </View>
  );
};
