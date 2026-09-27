import { FC } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme';
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
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <AppText style={styles.sectionTitle}>{'Itemized Split'}</AppText>
        <AppText style={styles.payerChipTextActive}>
          {`Total: ₹${itemsTotal.toFixed(2)}`}
        </AppText>
      </View>

      <AppText style={styles.subText}>
        {'Add items, specify cost, and choose who shares each item:'}
      </AppText>

      {items.map((item, idx) => (
        <View key={idx} style={styles.itemCard}>
          <View style={styles.itemRowTop}>
            <TextInput
              style={styles.itemNameInput}
              placeholder={`Item #${idx + 1} (e.g. Pizza)`}
              placeholderTextColor={colors.textSecondary}
              value={item.name}
              onChangeText={val => onItemNameChange(idx, val)}
            />

            <View style={styles.itemCostContainer}>
              <AppText style={styles.itemCostPrefix}>{'₹'}</AppText>
              <TextInput
                style={styles.itemCostInput}
                placeholder="0.00"
                placeholderTextColor={colors.textSecondary}
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

          <AppText style={styles.assigneeLabel}>{'Shared by:'}</AppText>

          <View style={styles.assigneeChips}>
            {members.map(m => {
              const isAssigned = item.assignedTo.includes(m.id);
              return (
                <Pressable
                  key={m.id}
                  style={[
                    styles.assigneeChip,
                    isAssigned && styles.assigneeChipSelected,
                  ]}
                  onPress={() => onToggleItemMember(idx, m.id)}
                >
                  <AppText
                    style={[
                      styles.assigneeChipText,
                      isAssigned && styles.assigneeChipTextSelected,
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
          <AppText style={styles.itemSummaryTitle}>
            {'Computed Shares'}
          </AppText>
          {members.map(m => {
            const amount = memberTotals[m.id] || 0;
            return (
              <View key={m.id} style={styles.itemSummaryRow}>
                <AppText style={styles.itemSummaryName}>{m.name}</AppText>
                <AppText style={styles.itemSummaryAmount}>
                  {`₹${amount.toFixed(2)}`}
                </AppText>
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};
