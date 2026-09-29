import { FC } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Users, Wallet, X } from 'lucide-react-native';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, space } from '@/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectPersonal: () => void;
  onSelectGroup: () => void;
};

export const AddExpenseActionModal: FC<Props> = ({
  visible,
  onClose,
  onSelectPersonal,
  onSelectGroup,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, space.md) },
          ]}
        >
          {/* Top Handle */}
          <View style={styles.handleBar} />

          {/* Header Row */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <AppText style={styles.title}>{'Add New Expense'}</AppText>
              <AppText style={styles.subtitle}>
                {'Select the type of expense to add'}
              </AppText>
            </View>

            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <X size={18} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Options */}
          <View style={styles.optionsList}>
            <Pressable
              style={({ pressed }) => [
                styles.optionCard,
                pressed && styles.optionCardPressed,
              ]}
              onPress={() => {
                onClose();
                onSelectPersonal();
              }}
            >
              <View
                style={[
                  styles.optionIconContainer,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <Wallet size={24} color={colors.primary} strokeWidth={2.2} />
              </View>

              <View style={styles.optionContent}>
                <AppText style={styles.optionTitle}>
                  {'Personal Expense'}
                </AppText>
                <AppText style={styles.optionSubtitle}>
                  {'Record a solo expense just for you'}
                </AppText>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.optionCard,
                pressed && styles.optionCardPressed,
              ]}
              onPress={() => {
                onClose();
                onSelectGroup();
              }}
            >
              <View
                style={[
                  styles.optionIconContainer,
                  { backgroundColor: 'rgba(99, 102, 241, 0.18)' },
                ]}
              >
                <Users size={24} color="#818CF8" strokeWidth={2.2} />
              </View>

              <View style={styles.optionContent}>
                <AppText style={styles.optionTitle}>{'Group Split'}</AppText>
                <AppText style={styles.optionSubtitle}>
                  {'Split an expense among group members'}
                </AppText>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#161A22',
    borderTopLeftRadius: radius['2xl'],
    borderTopRightRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: colors.border,
    paddingTop: space.sm,
    paddingHorizontal: space.md,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: space.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.sm,
    marginBottom: space.xs,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    gap: space.sm,
    paddingVertical: space.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: space.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: space.md,
  },
  optionCardPressed: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primary,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
