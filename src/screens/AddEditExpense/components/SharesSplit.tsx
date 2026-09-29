import { FC, useMemo } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useCurrency } from '@/hooks';
import { useAppTheme } from '@/theme';
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
  const { colors: themeColors } = useAppTheme();
  const { currencySymbol } = useCurrency();
  const totalShares = useMemo(() => {
    return members.reduce((sum, m) => {
      const val = parseFloat(memberShares[m.id] ?? '0');
      return sum + (isNaN(val) || val < 0 ? 0 : val);
    }, 0);
  }, [members, memberShares]);

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
          {'Split by Shares'}
        </AppText>
        <AppText style={[styles.payerChipTextActive, { color: themeColors.primary }]}>
          {`Total Shares: ${totalShares}`}
        </AppText>
      </View>

      <AppText style={[styles.subText, { color: themeColors.textSecondary }]}>
        {'Enter shares per person. Cost is split proportionally:'}
      </AppText>

      {members.map(m => {
        const raw = parseFloat(memberShares[m.id] ?? '0') || 0;
        const computedAmount =
          totalShares > 0 && totalAmount > 0
            ? ((raw / totalShares) * totalAmount).toFixed(2)
            : '0.00';

        return (
          <View
            key={m.id}
            style={[styles.memberRow, { borderBottomColor: themeColors.divider }]}
          >
            <AppText style={[styles.memberName, { color: themeColors.textPrimary }]}>
              {m.name}
            </AppText>

            <View style={styles.sharesInputRow}>
              <Pressable
                style={[
                  styles.stepperBtn,
                  {
                    backgroundColor: themeColors.surfaceAlt,
                    borderColor: themeColors.border,
                  },
                ]}
                onPress={() => onStepperChange(m.id, -1)}
              >
                <AppText
                  style={[
                    styles.stepperBtnText,
                    { color: themeColors.textPrimary },
                  ]}
                >
                  {'-'}
                </AppText>
              </Pressable>

              <TextInput
                style={[
                  styles.sharesInput,
                  {
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.border,
                    color: themeColors.textPrimary,
                  },
                ]}
                keyboardType="numeric"
                value={memberShares[m.id] || '0'}
                onChangeText={val => onShareChange(m.id, val)}
                placeholder="0"
                placeholderTextColor={themeColors.textSecondary}
              />

              <Pressable
                style={[
                  styles.stepperBtn,
                  {
                    backgroundColor: themeColors.surfaceAlt,
                    borderColor: themeColors.border,
                  },
                ]}
                onPress={() => onStepperChange(m.id, 1)}
              >
                <AppText
                  style={[
                    styles.stepperBtnText,
                    { color: themeColors.textPrimary },
                  ]}
                >
                  {'+'}
                </AppText>
              </Pressable>

              <AppText style={styles.computedShareBadge}>
                {`${currencySymbol}${computedAmount}`}
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );
};
