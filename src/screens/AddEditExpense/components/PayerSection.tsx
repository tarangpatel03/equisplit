import { FC, useMemo } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme';
import { Member } from '@/types';

import { styles } from '../styles';

type Props = {
  members: Member[];
  payerContributions: Record<string, string>;
  totalAmount: number;
  onPayerAmountChange: (memberId: string, value: string) => void;
  onSelectSinglePayer: (memberId: string) => void;
};

export const PayerSection: FC<Props> = ({
  members,
  payerContributions,
  totalAmount,
  onPayerAmountChange,
  onSelectSinglePayer,
}) => {
  const sumPaid = useMemo(() => {
    return members.reduce((acc, m) => {
      const val = parseFloat(payerContributions[m.id] ?? '0');
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [members, payerContributions]);

  const isPaidMatched =
    totalAmount > 0 && Math.abs(sumPaid - totalAmount) < 0.01;
  const difference = totalAmount - sumPaid;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <AppText style={styles.sectionTitle}>{'Who Paid?'}</AppText>
      </View>

      <AppText style={styles.subText}>
        {'Quick select who paid in full, or enter multiple amounts below:'}
      </AppText>

      {/* Quick 1-tap single payer selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipScroll}
      >
        {members.map(m => {
          const val = parseFloat(payerContributions[m.id] ?? '0') || 0;
          const isSinglePayer =
            val > 0 && totalAmount > 0 && Math.abs(val - totalAmount) < 0.01;
          return (
            <Pressable
              key={m.id}
              style={[
                styles.payerChip,
                isSinglePayer && styles.payerChipActive,
              ]}
              onPress={() => onSelectSinglePayer(m.id)}
            >
              <AppText
                style={[
                  styles.payerChipText,
                  isSinglePayer && styles.payerChipTextActive,
                ]}
              >
                {m.name}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Member rows with amount inputs */}
      {members.map(m => (
        <View key={m.id} style={styles.memberRow}>
          <AppText style={styles.memberName}>{m.name}</AppText>
          <View style={styles.memberInputContainer}>
            <AppText style={styles.currencyPrefix}>{'₹'}</AppText>
            <TextInput
              style={styles.numberInput}
              keyboardType="decimal-pad"
              value={payerContributions[m.id] ?? ''}
              onChangeText={val => onPayerAmountChange(m.id, val)}
              placeholder="0.00"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
        </View>
      ))}

      {/* Status indicator */}
      <View style={styles.statusRow}>
        <AppText
          style={
            isPaidMatched ? styles.statusTextSuccess : styles.statusTextError
          }
        >
          {isPaidMatched
            ? `✓ Paid ₹${sumPaid.toFixed(2)} of ₹${totalAmount.toFixed(2)}`
            : totalAmount <= 0
            ? 'Enter a valid total amount above'
            : difference > 0
            ? `Paid ₹${sumPaid.toFixed(2)} / ₹${totalAmount.toFixed(2)} (₹${difference.toFixed(2)} remaining)`
            : `Paid ₹${sumPaid.toFixed(2)} / ₹${totalAmount.toFixed(2)} (₹${Math.abs(difference).toFixed(2)} overpaid)`}
        </AppText>
      </View>
    </View>
  );
};
