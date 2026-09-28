import { FC, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserCheck, UserPlus } from 'lucide-react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { AppText } from '@/components/ui/AppText';
import { colors, radius, space, useAppTheme } from '@/theme';
import { Member } from '@/types';

type Props = {
  visible: boolean;
  memberToDelete: Member | null;
  otherMembers: Member[];
  loading: boolean;
  onConfirm: (choice: { selectedMemberId?: string; newMemberName?: string }) => void;
  onCancel: () => void;
};

export const ReplacePrimaryModal: FC<Props> = ({
  visible,
  memberToDelete,
  otherMembers,
  loading,
  onConfirm,
  onCancel,
}) => {
  const { colors: themeColors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [inputError, setInputError] = useState<string | undefined>();

  const handleSelectExisting = (id: string) => {
    setSelectedId(id);
    setNewName('');
    setInputError(undefined);
  };

  const handleNewNameChange = (text: string) => {
    setNewName(text);
    setSelectedId(null);
    setInputError(undefined);
  };

  const handleSubmit = () => {
    if (selectedId) {
      onConfirm({ selectedMemberId: selectedId });
      return;
    }

    const trimmed = newName.trim();
    if (trimmed) {
      onConfirm({ newMemberName: trimmed });
      return;
    }

    setInputError('Please select a member or enter a new name');
  };

  const isActionDisabled = !selectedId && !newName.trim();

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel} />

        <View
          style={[
            styles.dialog,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
              paddingBottom: Math.max(insets.bottom, space.md),
            },
          ]}
        >
          {/* Header */}
          <View style={styles.headerIconContainer}>
            <UserCheck size={28} color={themeColors.primary} strokeWidth={2.2} />
          </View>

          <AppText style={[styles.title, { color: themeColors.textPrimary }]}>
            {'Assign New Primary Profile'}
          </AppText>
          <AppText style={[styles.subtitle, { color: themeColors.textSecondary }]}>
            {`"${memberToDelete?.name ?? 'This member'}" is your primary profile ("You"). Choose who will become "You" before deleting this profile.`}
          </AppText>

          {/* Option A: Select from existing members */}
          {otherMembers.length > 0 && (
            <View style={styles.section}>
              <AppText style={[styles.sectionLabel, { color: themeColors.textSecondary }]}>
                {'Select an existing member:'}
              </AppText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {otherMembers.map(m => {
                  const isSelected = selectedId === m.id;
                  return (
                    <Pressable
                      key={m.id}
                      style={[
                        styles.memberChip,
                        {
                          backgroundColor: isSelected
                            ? themeColors.primary
                            : themeColors.surfaceAlt,
                          borderColor: isSelected
                            ? themeColors.primary
                            : themeColors.border,
                        },
                      ]}
                      onPress={() => handleSelectExisting(m.id)}
                    >
                      <AppText
                        style={[
                          styles.memberChipText,
                          {
                            color: isSelected
                              ? '#FFFFFF'
                              : themeColors.textPrimary,
                          },
                        ]}
                      >
                        {m.name}
                      </AppText>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Option B: Create new profile */}
          <View style={styles.section}>
            <View style={styles.newProfileLabelRow}>
              <UserPlus size={14} color={themeColors.textSecondary} />
              <AppText style={[styles.sectionLabel, { color: themeColors.textSecondary }]}>
                {otherMembers.length > 0
                  ? 'Or create a new profile as "You":'
                  : 'Enter your new name to continue as "You":'}
              </AppText>
            </View>
            <AppInput
              placeholder="e.g. Tarang"
              value={newName}
              onChangeText={handleNewNameChange}
              error={inputError}
              containerStyle={styles.inputContainer}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <AppButton
              label="Cancel"
              variant="ghost"
              style={styles.cancelBtn}
              onPress={onCancel}
              disabled={loading}
            />
            <AppButton
              label="Set & Remove"
              variant="danger"
              style={styles.confirmBtn}
              loading={loading}
              disabled={isActionDisabled}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.md,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: space.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  headerIconContainer: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: space.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: space.md,
  },
  section: {
    marginBottom: space.md,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: space.xs,
  },
  chipRow: {
    flexDirection: 'row',
    gap: space.xs + 2,
    paddingVertical: 2,
  },
  memberChip: {
    paddingHorizontal: space.sm + 4,
    paddingVertical: space.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  memberChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  memberChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  memberChipTextSelected: {
    color: colors.textOnPrimary,
  },
  newProfileLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: space.xs,
  },
  inputContainer: {
    marginBottom: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: space.sm,
    marginTop: space.sm,
  },
  cancelBtn: {
    flex: 1,
  },
  confirmBtn: {
    flex: 1.3,
  },
});
