import { memo, useCallback, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { AppConfirmDialog } from '@/components/common';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { AppText } from '@/components/ui/AppText';
import { borderRadius, colors, radius, space, useAppTheme } from '@/theme';

import type { Member } from '@/types';

type Props = {
  visible: boolean;
  members: Member[];
  onClose: () => void;
  onAdd: (name: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
};

export const MembersModal = memo(
  ({ visible, members, onClose, onAdd, onRemove }: Props) => {
    const { colors: themeColors } = useAppTheme();
    const [name, setName] = useState('');
    const [adding, setAdding] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
    const [removing, setRemoving] = useState(false);

    const handleAdd = async () => {
      const trimmed = name.trim();
      if (!trimmed) return;
      setAdding(true);
      await onAdd(trimmed);
      setName('');
      setAdding(false);
    };

    const handleConfirmRemove = async () => {
      if (!memberToDelete) return;
      setRemoving(true);
      try {
        await onRemove(memberToDelete.id);
        setMemberToDelete(null);
      } finally {
        setRemoving(false);
      }
    };

    const renderMemberItem = useCallback(
      ({ item }: { item: Member }) => (
        <View
          style={[
            styles.memberRow,
            { borderBottomColor: themeColors.divider },
          ]}
        >
          <AppText
            style={[
              styles.memberName,
              { color: themeColors.textPrimary },
            ]}
          >
            {item.name}
          </AppText>
          <Pressable
            onPress={() => setMemberToDelete(item)}
            hitSlop={8}
            style={styles.removeBtn}
          >
            <AppText style={styles.removeText}>{'✕'}</AppText>
          </Pressable>
        </View>
      ),
      [themeColors.divider, themeColors.textPrimary],
    );

    const renderEmptyMembers = useCallback(
      () => (
        <AppText style={[styles.empty, { color: themeColors.textSecondary }]}>
          {'No members yet. Add people above.'}
        </AppText>
      ),
      [themeColors.textSecondary],
    );

    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Pressable style={styles.overlay} onPress={onClose} />
          <View
            style={[
              styles.sheet,
              {
                backgroundColor: themeColors.surface,
                borderColor: themeColors.border,
                borderTopWidth: 1,
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: themeColors.border }]} />
            <AppText style={[styles.title, { color: themeColors.textPrimary }]}>
              {'Manage Group'}
            </AppText>

            <View style={styles.addRow}>
              <AppInput
                containerStyle={styles.addInput}
                placeholder="Member name"
                value={name}
                onChangeText={setName}
                onSubmitEditing={handleAdd}
                returnKeyType="done"
              />
              <AppButton
                label="Add"
                loading={adding}
                onPress={handleAdd}
                style={styles.addBtn}
              />
            </View>

            <FlatList
              data={members}
              keyExtractor={item => item.id}
              renderItem={renderMemberItem}
              ListEmptyComponent={renderEmptyMembers}
              style={styles.list}
            />

            <AppButton
              label="Done"
              variant="ghost"
              fullWidth
              onPress={onClose}
              style={styles.doneBtn}
            />
          </View>
        </KeyboardAvoidingView>

        {/* Member Delete Confirmation Dialog */}
        <AppConfirmDialog
          visible={Boolean(memberToDelete)}
          title="Remove Member"
          message={`Are you sure you want to remove "${memberToDelete?.name}" from the group?`}
          confirmLabel="Remove"
          cancelLabel="Cancel"
          loading={removing}
          useModal={false}
          onConfirm={handleConfirmRemove}
          onCancel={() => setMemberToDelete(null)}
        />
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    paddingHorizontal: space.md,
    paddingBottom: space.xl,
    paddingTop: space.sm,
    maxHeight: '70%',
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    marginBottom: space.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: space.md,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    marginBottom: space.sm,
  },
  addInput: {
    flex: 1,
    marginBottom: 0,
  },
  addBtn: {
    marginTop: 2,
    paddingHorizontal: space.md,
  },
  list: {
    maxHeight: 260,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  memberName: {
    fontSize: 15,
    color: colors.textPrimary,
  },
  removeBtn: {
    padding: 4,
  },
  removeText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '600',
  },
  empty: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: space.lg,
  },
  doneBtn: {
    marginTop: space.md,
  },
});
