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
import { useAppTheme } from '@/theme';
import { Member } from '@/types';

import {
  MemberBalanceCard,
  ReplacePrimaryModal,
  SettleUpModal,
} from './components';
import { useMembersScreen } from './hooks/useMembersScreen';
import { styles } from './styles';

export const MembersScreen: FC = () => {
  const { colors: themeColors } = useAppTheme();

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
        <AppText
          style={[styles.sectionTitle, { color: themeColors.textPrimary }]}
        >
          {'Group Balance'}
        </AppText>
        <View
          style={[
            styles.countBadge,
            { backgroundColor: themeColors.surfaceAlt },
          ]}
        >
          <AppText
            style={[styles.countText, { color: themeColors.textSecondary }]}
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
        <View
          style={[
            styles.noMembersCard,
            { backgroundColor: themeColors.surfaceAlt },
          ]}
        >
          <AppText
            style={[styles.noMembersText, { color: themeColors.textSecondary }]}
          >
            {'Add group members below to start calculating balances.'}
          </AppText>
        </View>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 2. MIDDLE: Manage Members                                           */}
      {/* ------------------------------------------------------------------- */}
      <View
        style={[
          styles.manageCard,
          {
            backgroundColor: themeColors.surface,
            borderColor: themeColors.border,
          },
        ]}
      >
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
                <View
                  key={m.id}
                  style={[
                    styles.memberChipRow,
                    {
                      backgroundColor: themeColors.surfaceAlt,
                      borderColor: themeColors.border,
                    },
                    m.isPrimary && {
                      backgroundColor: themeColors.primaryLight,
                      borderColor: themeColors.primary,
                    },
                  ]}
                >
                  <View style={styles.memberChipLeft}>
                    <View
                      style={[
                        styles.chipAvatar,
                        {
                          backgroundColor: themeColors.surface,
                          borderColor: themeColors.border,
                        },
                      ]}
                    >
                      <AppText
                        style={[
                          styles.chipAvatarText,
                          { color: themeColors.textPrimary },
                        ]}
                      >
                        {initial}
                      </AppText>
                    </View>
                    <AppText
                      style={[
                        styles.memberChipName,
                        { color: themeColors.textPrimary },
                      ]}
                      numberOfLines={1}
                    >
                      {m.name}
                    </AppText>
                    {m.isPrimary && (
                      <View
                        style={[
                          styles.primaryBadge,
                          { backgroundColor: themeColors.primaryLight },
                        ]}
                      >
                        <AppText
                          style={[
                            styles.primaryBadgeText,
                            { color: themeColors.primary },
                          ]}
                        >
                          {'You'}
                        </AppText>
                      </View>
                    )}
                  </View>

                  <View style={styles.memberActionsRight}>
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
      {/* 3. BOTTOM: Member Balances                                          */}
      {/* ------------------------------------------------------------------- */}
      <View style={styles.balancesHeader}>
        <View style={styles.balancesTitleRow}>
          <Image
            source={assets.icons.ic_credit_card}
            style={styles.walletIcon}
            resizeMode="contain"
          />
          <AppText
            style={[styles.balancesTitle, { color: themeColors.textPrimary }]}
          >
            {'Member Balances'}
          </AppText>
        </View>

        <View style={styles.headerActionsRight}>
          {members.length > 0 && (
            <Pressable
              style={[
                styles.shareHeaderBtn,
                {
                  backgroundColor: themeColors.surfaceAlt,
                  borderColor: themeColors.border,
                },
              ]}
              onPress={handleShareSummary}
              hitSlop={6}
            >
              <Share2
                size={13}
                color={themeColors.textSecondary}
                strokeWidth={2.2}
              />
              <AppText
                style={[
                  styles.shareHeaderBtnText,
                  { color: themeColors.textSecondary },
                ]}
              >
                {'Share'}
              </AppText>
            </Pressable>
          )}

          {members.length > 1 && (
            <Pressable
              style={styles.settleUpHeaderBtn}
              onPress={() => handleOpenSettleUp()}
              hitSlop={6}
            >
              <HandCoins
                size={14}
                color={themeColors.primary}
                strokeWidth={2.4}
              />
              <AppText style={styles.settleUpHeaderBtnText}>
                {'Settle Up'}
              </AppText>
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.statusSummaryRow}>
        <AppText
          style={[
            styles.statusSummaryText,
            { color: themeColors.textSecondary },
          ]}
        >
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
          <View
            style={[
              styles.emptyBalancesCard,
              {
                backgroundColor: themeColors.surfaceAlt,
                borderColor: themeColors.border,
              },
            ]}
          >
            <AppText
              style={[
                styles.emptyBalancesText,
                { color: themeColors.textSecondary },
              ]}
            >
              {
                'No member balances to display. Add members and expenses to track who owes whom.'
              }
            </AppText>
          </View>
        )}
      </View>

      {/* Delete Member Confirmation Dialog */}
      <AppConfirmDialog
        visible={Boolean(memberToDelete)}
        title="Remove Member"
        message={`Are you sure you want to remove "${memberToDelete?.name}" from the group?`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setMemberToDelete(null)}
      />

      {/* Replace Primary Member Modal Flow */}
      <ReplacePrimaryModal
        visible={Boolean(primaryMemberToDelete)}
        memberToRemove={primaryMemberToDelete!}
        otherMembers={members.filter(m => m.id !== primaryMemberToDelete?.id)}
        loading={deleting}
        onConfirm={handleReplacePrimaryAndRemove}
        onCancel={() => setPrimaryMemberToDelete(null)}
      />

      {/* Unsettled Member Warning Dialog */}
      <AppConfirmDialog
        visible={Boolean(unsettledMemberWarning)}
        title="Cannot Remove Member"
        message={
          unsettledMemberWarning
            ? `${
                unsettledMemberWarning.member.name
              } has an unsettled balance of ${
                unsettledMemberWarning.balance > 0 ? '+' : '-'
              }₹${Math.abs(unsettledMemberWarning.balance).toFixed(
                2,
              )}. Please settle all balances before removing this member.`
            : ''
        }
        confirmLabel="Understood"
        confirmVariant="primary"
        cancelLabel=""
        onConfirm={() => setUnsettledMemberWarning(null)}
        onCancel={() => setUnsettledMemberWarning(null)}
      />

      {/* Settle Up Flow Modal */}
      <SettleUpModal
        visible={settleModalVisible}
        members={members}
        initialPayer={settleTarget?.payer}
        initialReceiver={settleTarget?.receiver}
        initialAmount={settleTarget?.amount}
        loading={savingSettlement}
        onClose={handleCloseSettleUp}
        onConfirm={handleRecordSettlement}
      />
    </AppScreen>
  );
};
