import { FC } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

import { HandCoins, Share2 } from 'lucide-react-native';

import { assets } from '@/assets';
import { AppConfirmDialog } from '@/components/common';
import { AppBadge } from '@/components/ui/AppBadge';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { AppScreen } from '@/components/ui/AppScreen';
import { AppText } from '@/components/ui/AppText';
import { colors } from '@/theme';
import { Member } from '@/types';

import {
  MemberBalanceCard,
  ReplacePrimaryModal,
  SettleUpModal,
} from './components';
import { useMembersScreen } from './hooks/useMembersScreen';
import { styles } from './styles';

export const MembersScreen: FC = () => {
  const {
    members,
    balances,
    pairwiseDetails,
    newName,
    setNewName,
    adding,
    memberToDelete,
    setMemberToDelete,
    primaryMemberToDelete,
    setPrimaryMemberToDelete,
    unsettledMemberWarning,
    setUnsettledMemberWarning,
    deleting,
    settleModalVisible,
    settleTarget,
    savingSettlement,
    handleAddMember,
    handleRequestDelete,
    handleConfirmDelete,
    handleReplacePrimaryAndRemove,
    handleSetPrimary,
    handleOpenSettleUp,
    handleCloseSettleUp,
    handleRecordSettlement,
    handleShareSummary,
  } = useMembersScreen();

  return (
    <AppScreen
      screenTitle="Members & Balances"
      showBackButton={false}
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
                    {m.isPrimary && (
                      <View style={styles.primaryBadge}>
                        <AppText style={styles.primaryBadgeText}>{'You'}</AppText>
                      </View>
                    )}
                  </View>

                  <View style={styles.memberActionsRight}>
                    {!m.isPrimary && (
                      <Pressable
                        style={styles.setPrimaryBtn}
                        onPress={() => handleSetPrimary(m.id)}
                        hitSlop={4}
                      >
                        <AppText style={styles.setPrimaryBtnText}>
                          {'Set as Me'}
                        </AppText>
                      </Pressable>
                    )}

                    <Pressable
                      hitSlop={8}
                      style={styles.deleteMemberBtn}
                      onPress={() => handleRequestDelete(m)}
                    >
                      <Image
                        source={assets.icons.ic_delete}
                        style={styles.deleteIcon}
                        resizeMode="contain"
                      />
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>

      {/* ------------------------------------------------------------------- */}
      {/* 3. BOTTOM: Member Balances (Reference Design)                       */}
      {/* ------------------------------------------------------------------- */}
      <View style={styles.balancesHeader}>
        <View style={styles.balancesTitleRow}>
          <Image
            source={assets.icons.ic_credit_card}
            style={styles.walletIcon}
            resizeMode="contain"
          />
          <AppText style={styles.balancesTitle}>{'Member Balances'}</AppText>
        </View>

        <View style={styles.headerActionsRight}>
          {members.length > 0 && (
            <Pressable
              style={styles.shareHeaderBtn}
              onPress={handleShareSummary}
              hitSlop={6}
            >
              <Share2 size={13} color={colors.textSecondary} strokeWidth={2.2} />
              <AppText style={styles.shareHeaderBtnText}>{'Share'}</AppText>
            </Pressable>
          )}

          {members.length > 1 && (
            <Pressable
              style={styles.settleUpHeaderBtn}
              onPress={() => handleOpenSettleUp()}
              hitSlop={6}
            >
              <HandCoins size={14} color={colors.primary} strokeWidth={2.4} />
              <AppText style={styles.settleUpHeaderBtnText}>{'Settle Up'}</AppText>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.statusSummaryRow}>
        <AppText style={styles.statusSummaryText}>
          {'• Detailed breakdown of who owes whom'}
        </AppText>
      </View>

      <View style={styles.cardsContainer}>
        {pairwiseDetails.length > 0 ? (
          pairwiseDetails.map(detail => (
            <MemberBalanceCard
              key={detail.member.id}
              detail={detail}
              onSettleUp={handleOpenSettleUp}
            />
          ))
        ) : (
          <View style={styles.emptyBalancesCard}>
            <AppText style={styles.emptyBalancesText}>
              {
                'No member balances to display. Add members and expenses to track who owes whom.'
              }
            </AppText>
          </View>
        )}
      </View>

      {/* Warning Dialog for Unsettled Balances */}
      <AppConfirmDialog
        visible={Boolean(unsettledMemberWarning)}
        title="Cannot Remove Member"
        message={`"${unsettledMemberWarning?.member.name}" has an unsettled balance of ₹${Math.abs(
          unsettledMemberWarning?.balance ?? 0,
        ).toFixed(2)} (${
          (unsettledMemberWarning?.balance ?? 0) > 0 ? 'is owed money' : 'owes money'
        }). All balances must be settled before removing this member.`}
        confirmLabel="Understood"
        cancelLabel=""
        confirmVariant="primary"
        onConfirm={() => setUnsettledMemberWarning(null)}
        onCancel={() => setUnsettledMemberWarning(null)}
      />

      {/* Confirmation Dialog for Standard Member Deletion */}
      <AppConfirmDialog
        visible={Boolean(memberToDelete)}
        title="Remove Member"
        message={`Are you sure you want to remove "${memberToDelete?.name}"?`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setMemberToDelete(null)}
      />

      {/* Modal for Primary Member Removal and Reassignment */}
      <ReplacePrimaryModal
        visible={Boolean(primaryMemberToDelete)}
        memberToDelete={primaryMemberToDelete}
        otherMembers={members.filter(m => m.id !== primaryMemberToDelete?.id)}
        loading={deleting}
        onConfirm={handleReplacePrimaryAndRemove}
        onCancel={() => setPrimaryMemberToDelete(null)}
      />

      {/* Settle Up Modal */}
      <SettleUpModal
        visible={settleModalVisible}
        members={members}
        pairwiseDetails={pairwiseDetails}
        initialPayerId={settleTarget?.payer?.id}
        initialReceiverId={settleTarget?.receiver?.id}
        initialAmount={settleTarget?.amount}
        loading={savingSettlement}
        onClose={handleCloseSettleUp}
        onSaveSettlement={handleRecordSettlement}
      />
    </AppScreen>
  );
};
