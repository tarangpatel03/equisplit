import { FC } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

import { assets } from '@/assets';
import { AppConfirmDialog } from '@/components/common';
import { AppBadge } from '@/components/ui/AppBadge';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { Member } from '@/types';

import { useMembersScreen } from './hooks/useMembersScreen';
import { styles } from './styles';

export const MembersScreen: FC = () => {
  const {
    members,
    balances,
    newName,
    setNewName,
    adding,
    memberToDelete,
    setMemberToDelete,
    deleting,
    handleAddMember,
    handleConfirmDelete,
  } = useMembersScreen();

  return (
    <AppScreen
      screenTitle="Members & Balances"
      preset="scroll"
      dismissKeyboardOnTouch={false}
      keyboardAvoiding={false}
      safeAreaEdges={['top']}
      contentContainerStyle={styles.scrollContent}
    >
      {/* ------------------------------------------------------------------- */}
      {/* 1. TOP: Group Balance Summary Pills                                 */}
      {/* ------------------------------------------------------------------- */}
      <View style={styles.sectionHeader}>
        <AppText style={styles.sectionTitle}>{'Group Balance'}</AppText>
        <View style={styles.countBadge}>
          <AppText
            style={styles.countText}
          >{`${members.length} members`}</AppText>
        </View>
      </View>

      {members.length > 0 ? (
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.balanceScroll}
          contentContainerStyle={styles.balanceRow}
        >
          {members.map((m: Member) => (
            <AppBadge key={m.id} label={m.name} amount={balances[m.id] ?? 0} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noMembersCard}>
          <AppText style={styles.noMembersText}>
            {'Add group members below to start calculating balances.'}
          </AppText>
        </View>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 2. MIDDLE: Manage Members                                           */}
      {/* ------------------------------------------------------------------- */}
      <View style={styles.manageCard}>
        <View style={styles.addMemberRow}>
          <AppInput
            containerStyle={styles.addInput}
            placeholder="Add new member..."
            value={newName}
            onChangeText={setNewName}
            onSubmitEditing={handleAddMember}
            returnKeyType="done"
          />
          <AppButton
            label="Add"
            variant="primary"
            style={styles.addBtn}
            loading={adding}
            onPress={handleAddMember}
          />
        </View>

        {members.length > 0 ? (
          <View style={styles.membersList}>
            {members.map((m: Member) => {
              const initial = m.name.charAt(0).toUpperCase();
              return (
                <View key={m.id} style={styles.memberChipRow}>
                  <View style={styles.memberChipLeft}>
                    <View style={styles.chipAvatar}>
                      <AppText style={styles.chipAvatarText}>{initial}</AppText>
                    </View>
                    <AppText style={styles.memberChipName} numberOfLines={1}>
                      {m.name}
                    </AppText>
                  </View>

                  <Pressable
                    hitSlop={8}
                    style={styles.deleteMemberBtn}
                    onPress={() => setMemberToDelete(m)}
                  >
                    <Image
                      source={assets.icons.ic_delete}
                      style={styles.deleteIcon}
                      resizeMode="contain"
                    />
                  </Pressable>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>

      {/* Confirmation Dialog for Member Deletion */}
      <AppConfirmDialog
        visible={Boolean(memberToDelete)}
        title="Remove Member"
        message={`Are you sure you want to remove "${memberToDelete?.name}"? Historical expense calculations involving this member may be affected.`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setMemberToDelete(null)}
      />
    </AppScreen>
  );
};
