import React, { FC, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Check, UserCheck, X } from 'lucide-react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { colors, hexToRgba, radius, space, useAppTheme } from '@/theme';
import { Member } from '@/types';

type Props = {
  visible: boolean;
  members: Member[];
  currentPrimaryId?: string;
  onSelect: (memberId: string) => void;
  onClose: () => void;
  loading?: boolean;
};

export const SwitchPrimaryModal: FC<Props> = ({
  visible,
  members,
  currentPrimaryId,
  onSelect,
  onClose,
  loading = false,
}) => {
  const { colors: themeColors } = useAppTheme();
  const [selectedId, setSelectedId] = useState<string>(
    currentPrimaryId ?? members[0]?.id ?? '',
  );

  const handleConfirm = () => {
    if (selectedId && selectedId !== currentPrimaryId) {
      onSelect(selectedId);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.content,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                },
              ]}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <View style={styles.iconCircle}>
                    <UserCheck size={20} color={themeColors.primary} />
                  </View>
                  <View>
                    <AppText style={[styles.title, { color: themeColors.textPrimary }]}>
                      {'Switch Primary User'}
                    </AppText>
                    <AppText style={[styles.subtitle, { color: themeColors.textSecondary }]}>
                      {'Select who should be identified as "You"'}
                    </AppText>
                  </View>
                </View>
                <Pressable
                  onPress={onClose}
                  hitSlop={8}
                  style={styles.closeBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <X size={20} color={themeColors.textSecondary} />
                </Pressable>
              </View>

              {/* Members List */}
              <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                {members.map(m => {
                  const isSelected = selectedId === m.id;
                  const isCurrent = currentPrimaryId === m.id;
                  return (
                    <Pressable
                      key={m.id}
                      style={[
                        styles.memberRow,
                        isSelected && styles.memberRowSelected,
                      ]}
                      onPress={() => setSelectedId(m.id)}
                    >
                      <View
                        style={[
                          styles.memberAvatar,
                          {
                            backgroundColor: themeColors.surfaceAlt,
                            borderColor: themeColors.border,
                          },
                        ]}
                      >
                        <AppText style={[styles.avatarLetter, { color: themeColors.primary }]}>
                          {m.name.charAt(0).toUpperCase()}
                        </AppText>
                      </View>
                      <View style={styles.memberNameContainer}>
                        <AppText style={[styles.memberName, { color: themeColors.textPrimary }]}>
                          {m.name}
                        </AppText>
                        {isCurrent ? (
                          <AppText style={[styles.currentTag, { color: themeColors.textSecondary }]}>
                            {'(Current Active Profile)'}
                          </AppText>
                        ) : null}
                      </View>
                      <View
                        style={[
                          styles.radio,
                          { borderColor: themeColors.border },
                          isSelected && styles.radioSelected,
                        ]}
                      >
                        {isSelected && (
                          <Check size={14} color={colors.textOnPrimary} strokeWidth={3} />
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Action Buttons */}
              <View style={styles.footer}>
                <AppButton
                  label="Cancel"
                  variant="ghost"
                  onPress={onClose}
                  style={styles.cancelBtn}
                />
                <AppButton
                  label="Set as Active"
                  variant="primary"
                  loading={loading}
                  disabled={loading || selectedId === currentPrimaryId}
                  onPress={handleConfirm}
                  style={styles.confirmBtn}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.md,
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    maxHeight: '80%',
    padding: space.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  closeBtn: {
    padding: 4,
  },
  list: {
    marginVertical: space.xs,
    maxHeight: 280,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.sm + 2,
    paddingHorizontal: space.sm,
    borderRadius: radius.md,
    marginBottom: space.xs,
    gap: space.sm,
  },
  memberRowSelected: {
    backgroundColor: hexToRgba(colors.primary, 0.08),
    borderWidth: 1,
    borderColor: hexToRgba(colors.primary, 0.3),
  },
  memberAvatar: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarLetter: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  memberNameContainer: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  currentTag: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    gap: space.sm,
    marginTop: space.md,
  },
  cancelBtn: {
    flex: 1,
  },
  confirmBtn: {
    flex: 1.4,
  },
});
