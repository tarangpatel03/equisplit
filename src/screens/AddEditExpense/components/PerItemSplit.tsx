import { FC } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { useCurrency } from '@/hooks';
import { useAppTheme } from '@/theme';
import { ExpenseItem, Member } from '@/types';

import { styles } from '../styles';

type Props = {
  members: Member[];
  items: ExpenseItem[];
  onAddItem: () => void;
  onDeleteItem: (index: number) => void;
  onItemNameChange: (index: number, name: string) => void;
  onItemCostChange: (index: number, costStr: string) => void;
  onToggleItemMember: (index: number, memberId: string) => void;
};

export const PerItemSplit: FC<Props> = ({
  members,
  items,
  onAddItem,
  onDeleteItem,
  onItemNameChange,
  onItemCostChange,
  onToggleItemMember,
}) => {
  const { colors: themeColors } = useAppTheme();
  const { currencySymbol } = useCurrency();

  // Compute per-member breakdown
  const memberTotals: Record<string, number> = {};
  for (const item of items) {
    const cost = Number(item.cost) || 0;
    const assignees = item.assignedTo;
    if (cost > 0 && assignees.length > 0) {
      const split = cost / assignees.length;
      for (const mId of assignees) {
        memberTotals[mId] = (memberTotals[mId] || 0) + split;
      }
    }
  }

  const itemsTotal = items.reduce(
    (sum, item) => sum + (Number(item.cost) || 0),
    0,
  );

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
          {'Itemized Split'}
        </AppText>
        <AppText style={[styles.payerChipTextActive, { color: themeColors.primary }]}>
          {`Total: ${currencySymbol}${itemsTotal.toFixed(2)}`}
        </AppText>
      </View>

      <AppText style={[styles.subText, { color: themeColors.textSecondary }]}>
        {'Add items, specify cost, and choose who shares each item:'}
      </AppText>

      {items.map((item, idx) => (
        <View
          key={idx}
          style={[
            styles.itemCard,
            {
              backgroundColor: themeColors.surfaceAlt,
              borderColor: themeColors.border,
            },
          ]}
        >
          <View style={styles.itemRowTop}>
            <TextInput
              style={[
                styles.itemNameInput,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                  color: themeColors.textPrimary,
                },
              ]}
              placeholder={`Item #${idx + 1} (e.g. Pizza)`}
              placeholderTextColor={themeColors.textSecondary}
              value={item.name}
              onChangeText={val => onItemNameChange(idx, val)}
            />

            <View
              style={[
                styles.itemCostContainer,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <AppText style={[styles.itemCostPrefix, { color: themeColors.textSecondary }]}>
                {currencySymbol}
              </AppText>
              <TextInput
                style={[styles.itemCostInput, { color: themeColors.textPrimary }]}
                placeholder="0.00"
                placeholderTextColor={themeColors.textSecondary}
                keyboardType="decimal-pad"
                value={item.cost > 0 ? item.cost.toString() : ''}
                onChangeText={val => onItemCostChange(idx, val)}
              />
            </View>

            {items.length > 1 ? (
              <Pressable
                style={styles.itemDeleteBtn}
                onPress={() => onDeleteItem(idx)}
              >
                <AppText style={styles.itemDeleteText}>{'✕'}</AppText>
              </Pressable>
            ) : null}
          </View>

          <AppText style={[styles.assigneeLabel, { color: themeColors.textSecondary }]}>
            {'Shared by:'}
          </AppText>

          <View style={styles.assigneeChips}>
            {members.map(m => {
              const isAssigned = item.assignedTo.includes(m.id);
              return (
                <Pressable
                  key={m.id}
                  style={[
                    styles.assigneeChip,
                    {
                      backgroundColor: isAssigned
                        ? themeColors.primaryLight
                        : themeColors.surface,
                      borderColor: isAssigned
                        ? themeColors.primary
                        : themeColors.border,
                    },
                  ]}
                  onPress={() => onToggleItemMember(idx, m.id)}
                >
                  <AppText
                    style={[
                      styles.assigneeChipText,
                      {
                        color: isAssigned
                          ? themeColors.primary
                          : themeColors.textSecondary,
                      },
                    ]}
                  >
                    {m.name}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      <Pressable style={styles.addItemBtn} onPress={onAddItem}>
        <AppText style={styles.addItemBtnText}>{'+ Add Item'}</AppText>
      </Pressable>

      {/* Summary breakdown per member */}
      {itemsTotal > 0 ? (
        <View style={styles.itemSummaryContainer}>
          <AppText style={[styles.itemSummaryTitle, { color: themeColors.textPrimary }]}>
            {'Computed Shares'}
          </AppText>
          {members.map(m => {
            const amount = memberTotals[m.id] || 0;
            return (
              <View key={m.id} style={styles.itemSummaryRow}>
                <AppText style={[styles.itemSummaryName, { color: themeColors.textSecondary }]}>
                  {m.name}
                </AppText>
                <AppText style={[styles.itemSummaryAmount, { color: themeColors.textPrimary }]}>
                  {`${currencySymbol}${amount.toFixed(2)}`}
                </AppText>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};
