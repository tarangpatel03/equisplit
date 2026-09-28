import { FC, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRight, Calendar, HandCoins } from 'lucide-react-native';

import { AppDatePicker } from '@/components/common';
import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { AppText } from '@/components/ui/AppText';
import { colors, radius, space, useAppTheme } from '@/theme';
import { Member } from '@/types';
import { MemberBalanceDetail } from '@/utils';

type Props = {
  visible: boolean;
  members: Member[];
  pairwiseDetails?: MemberBalanceDetail[];
  initialPayerId?: string;
  initialReceiverId?: string;
  initialAmount?: number;
  loading?: boolean;
  onClose: () => void;
  onSaveSettlement: (settlement: {
    payerId: string;
    receiverId: string;
    amount: number;
    date: Date;
    note?: string;
  }) => Promise<void>;
};

export const SettleUpModal: FC<Props> = ({
  visible,
  members,
  pairwiseDetails = [],
  initialPayerId,
  initialReceiverId,
  initialAmount,
  loading = false,
  onClose,
  onSaveSettlement,
}) => {
  const { colors: themeColors } = useAppTheme();
  const insets = useSafeAreaInsets();

  const [payerId, setPayerId] = useState<string>('');
  const [receiverId, setReceiverId] = useState<string>('');
  const [amountStr, setAmountStr] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | undefined>();

  // Determine active debt between any two members
  const getDebtBetween = (debtorId: string, creditorId: string): number => {
    const detail = pairwiseDetails.find(d => d.member.id === debtorId);
    if (!detail) return 0;
    const bd = detail.breakdowns.find(b => b.otherMemberId === creditorId);
    if (!bd) return 0;
    // bd.amount < 0 means debtor owes creditor |bd.amount|
    return bd.amount < -0.005 ? Math.abs(bd.amount) : 0;
  };

  useEffect(() => {
    if (!visible) return;

    setDate(new Date());
    setError(undefined);

    let defaultPayer = initialPayerId;
    let defaultReceiver = initialReceiverId;

    if (!defaultPayer || !defaultReceiver) {
      // Find the first pairwise debt in the group to auto-suggest
      for (const d of pairwiseDetails) {
        for (const b of d.breakdowns) {
          if (b.amount < -0.005) {
            defaultPayer = defaultPayer || d.member.id;
            defaultReceiver = defaultReceiver || b.otherMemberId;
            break;
          }
        }
        if (defaultPayer && defaultReceiver) break;
      }
    }

    // Fallbacks if no debt exists
    if (!defaultPayer && members.length > 0) {
      defaultPayer = members[0].id;
    }
    if (!defaultReceiver && members.length > 1) {
      defaultReceiver = members.find(m => m.id !== defaultPayer)?.id ?? members[1].id;
    }

    setPayerId(defaultPayer ?? '');
    setReceiverId(defaultReceiver ?? '');

    if (initialAmount && initialAmount > 0) {
      setAmountStr(initialAmount.toString());
    } else if (defaultPayer && defaultReceiver) {
      const debt = getDebtBetween(defaultPayer, defaultReceiver);
      setAmountStr(debt > 0 ? debt.toString() : '');
    } else {
      setAmountStr('');
    }

    setNote('');
  }, [visible, initialPayerId, initialReceiverId, initialAmount, members, pairwiseDetails]);

  const payer = useMemo(() => members.find(m => m.id === payerId), [members, payerId]);
  const receiver = useMemo(
    () => members.find(m => m.id === receiverId),
    [members, receiverId],
  );

  const activeDebt = useMemo(() => {
    if (!payerId || !receiverId) return 0;
    return getDebtBetween(payerId, receiverId);
  }, [payerId, receiverId, pairwiseDetails]);

  const handleSelectPayer = (id: string) => {
    setPayerId(id);
    setError(undefined);
    if (id === receiverId) {
      const nextReceiver = members.find(m => m.id !== id)?.id ?? '';
      setReceiverId(nextReceiver);
      const debt = getDebtBetween(id, nextReceiver);
      setAmountStr(debt > 0 ? debt.toString() : '');
    } else {
      const debt = getDebtBetween(id, receiverId);
      setAmountStr(debt > 0 ? debt.toString() : '');
    }
  };

  const handleSelectReceiver = (id: string) => {
    setReceiverId(id);
    setError(undefined);
    if (id === payerId) {
      const nextPayer = members.find(m => m.id !== id)?.id ?? '';
      setPayerId(nextPayer);
      const debt = getDebtBetween(nextPayer, id);
      setAmountStr(debt > 0 ? debt.toString() : '');
    } else {
      const debt = getDebtBetween(payerId, id);
      setAmountStr(debt > 0 ? debt.toString() : '');
    }
  };

  const handleAmountChange = (text: string) => {
    setAmountStr(text);
    setError(undefined);
  };

  const handleQuickFillDebt = () => {
    if (activeDebt > 0) {
      setAmountStr(activeDebt.toString());
    }
  };

  const handleSubmit = async () => {
    if (!payerId || !receiverId || payerId === receiverId) {
      setError('Please select two different members');
      return;
    }

    const parsedAmount = parseFloat(amountStr);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid payment amount');
      return;
    }

    await onSaveSettlement({
      payerId,
      receiverId,
      amount: Math.round(parsedAmount * 100) / 100,
      date,
      note: note.trim() || undefined,
    });
  };

  const formattedDate = date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          <View style={styles.overlay}>
            <Pressable style={styles.backdrop} onPress={onClose} />

            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                  paddingBottom: Math.max(insets.bottom, space.md),
                },
              ]}
            >
              {/* Handle Bar */}
              <View style={[styles.handleBar, { backgroundColor: themeColors.border }]} />

              {/* Title Header */}
              <View style={styles.header}>
                <View style={styles.headerIconBox}>
                  <HandCoins size={22} color={themeColors.credit} strokeWidth={2.4} />
                </View>
                <View style={styles.headerTextCol}>
                  <AppText style={[styles.title, { color: themeColors.textPrimary }]}>
                    {'Record Settlement'}
                  </AppText>
                  <AppText style={[styles.subtitle, { color: themeColors.textSecondary }]}>
                    {'Log a cash or UPI payment between group members'}
                  </AppText>
                </View>
              </View>

              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {/* Visual Transfer Pill */}
                <View
                  style={[
                    styles.transferSummaryBox,
                    {
                      backgroundColor: themeColors.surfaceAlt,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <View style={styles.memberAvatarBox}>
                    <AppText style={styles.memberAvatarText}>
                      {payer?.name.charAt(0).toUpperCase() ?? '?'}
                    </AppText>
                  </View>
                  <View style={styles.memberNameCol}>
                    <AppText style={[styles.transferRole, { color: themeColors.textSecondary }]}>
                      {'Paid by'}
                    </AppText>
                    <AppText
                      style={[styles.transferName, { color: themeColors.textPrimary }]}
                      numberOfLines={1}
                    >
                      {payer?.name ?? 'Select'}
                    </AppText>
                  </View>

                  <View style={styles.arrowBox}>
                    <ArrowRight size={18} color={themeColors.primary} strokeWidth={2.4} />
                  </View>

                  <View style={styles.memberNameCol}>
                    <AppText style={[styles.transferRole, { color: themeColors.textSecondary }]}>
                      {'Received by'}
                    </AppText>
                    <AppText
                      style={[styles.transferName, { color: themeColors.textPrimary }]}
                      numberOfLines={1}
                    >
                      {receiver?.name ?? 'Select'}
                    </AppText>
                  </View>
                  <View style={[styles.memberAvatarBox, styles.receiverAvatarBox]}>
                    <AppText style={styles.memberAvatarText}>
                      {receiver?.name.charAt(0).toUpperCase() ?? '?'}
                    </AppText>
                  </View>
                </View>

                {/* 1. Who Paid? */}
                <View style={styles.section}>
                  <AppText style={[styles.sectionLabel, { color: themeColors.textSecondary }]}>
                    {'Who paid?'}
                  </AppText>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipRow}
                  >
                    {members.map(m => {
                      const isSelected = payerId === m.id;
                      return (
                        <Pressable
                          key={`payer-${m.id}`}
                          style={[
                            styles.chip,
                            {
                              backgroundColor: isSelected
                                ? themeColors.primary
                                : themeColors.surfaceAlt,
                              borderColor: isSelected
                                ? themeColors.primary
                                : themeColors.border,
                            },
                          ]}
                          onPress={() => handleSelectPayer(m.id)}
                        >
                          <AppText
                            style={[
                              styles.chipText,
                              {
                                color: isSelected
                                  ? '#FFFFFF'
                                  : themeColors.textSecondary,
                              },
                            ]}
                          >
                            {m.name}
                            {m.isPrimary ? ' (You)' : ''}
                          </AppText>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* 2. Who Received? */}
                <View style={styles.section}>
                  <AppText style={[styles.sectionLabel, { color: themeColors.textSecondary }]}>
                    {'Who received?'}
                  </AppText>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipRow}
                  >
                    {members.map(m => {
                      const isSelected = receiverId === m.id;
                      const isSameAsPayer = payerId === m.id;
                      return (
                        <Pressable
                          key={`receiver-${m.id}`}
                          style={[
                            styles.chip,
                            {
                              backgroundColor: isSelected
                                ? themeColors.credit
                                : themeColors.surfaceAlt,
                              borderColor: isSelected
                                ? themeColors.credit
                                : themeColors.border,
                            },
                            isSameAsPayer && styles.chipDisabled,
                          ]}
                          onPress={() => handleSelectReceiver(m.id)}
                        >
                          <AppText
                            style={[
                              styles.chipText,
                              {
                                color: isSelected
                                  ? '#FFFFFF'
                                  : isSameAsPayer
                                  ? themeColors.textSecondary
                                  : themeColors.textSecondary,
                              },
                            ]}
                          >
                            {m.name}
                            {m.isPrimary ? ' (You)' : ''}
                          </AppText>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

                {/* 3. Amount */}
                <View style={styles.section}>
                  <View style={styles.amountLabelRow}>
                    <AppText style={[styles.sectionLabel, { color: themeColors.textSecondary }]}>
                      {'Amount Paid'}
                    </AppText>
                    {activeDebt > 0 && (
                      <Pressable
                        style={styles.fullDebtBadge}
                        onPress={handleQuickFillDebt}
                        hitSlop={4}
                      >
                        <AppText style={styles.fullDebtText}>
                          {`Full balance: ₹${activeDebt.toFixed(2)}`}
                        </AppText>
                      </Pressable>
                    )}
                  </View>
                  <AppInput
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    value={amountStr}
                    onChangeText={handleAmountChange}
                    error={error}
                    containerStyle={styles.amountInputContainer}
                  />
                </View>

                {/* 4. Date Picker Button */}
                <View style={styles.section}>
                  <AppText style={[styles.sectionLabel, { color: themeColors.textSecondary }]}>
                    {'Payment Date'}
                  </AppText>
                  <Pressable
                    style={[
                      styles.dateSelector,
                      {
                        backgroundColor: themeColors.surfaceAlt,
                        borderColor: themeColors.border,
                      },
                    ]}
                    onPress={() => setIsDatePickerVisible(true)}
                  >
                    <Calendar size={18} color={themeColors.primary} />
                    <AppText
                      style={[
                        styles.dateSelectorText,
                        { color: themeColors.textPrimary },
                      ]}
                    >
                      {formattedDate}
                    </AppText>
                  </Pressable>
                </View>

                {/* 5. Note / Payment Method */}
                <View style={styles.section}>
                  <AppText style={[styles.sectionLabel, { color: themeColors.textSecondary }]}>
                    {'Note / Payment Method (Optional)'}
                  </AppText>
                  <AppInput
                    placeholder="e.g. UPI, GPay, Cash, Bank Transfer"
                    value={note}
                    onChangeText={setNote}
                    containerStyle={styles.noteInputContainer}
                  />
                </View>
              </ScrollView>

              {/* Action Buttons */}
              <View
                style={[
                  styles.footerRow,
                  { borderTopColor: themeColors.border },
                ]}
              >
                <AppButton
                  label="Cancel"
                  variant="ghost"
                  style={styles.cancelBtn}
                  onPress={onClose}
                  disabled={loading}
                />
                <AppButton
                  label="Record Settlement"
                  variant="primary"
                  style={styles.submitBtn}
                  loading={loading}
                  onPress={handleSubmit}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Date Picker Modal */}
      <AppDatePicker
        visible={isDatePickerVisible}
        value={date}
        onConfirm={d => {
          setDate(d);
          setIsDatePickerVisible(false);
        }}
        onCancel={() => setIsDatePickerVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: space.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginBottom: space.md,
    paddingHorizontal: space.xs,
  },
  headerIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: 'rgba(46, 213, 115, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scroll: {
    maxHeight: 460,
  },
  scrollContent: {
    paddingBottom: space.md,
  },
  transferSummaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.lg,
    padding: space.md,
    marginBottom: space.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  memberAvatarBox: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiverAvatarBox: {
    backgroundColor: 'rgba(46, 213, 115, 0.16)',
  },
  memberAvatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  memberNameCol: {
    flex: 1,
    paddingHorizontal: space.xs + 2,
  },
  transferRole: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  transferName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  arrowBox: {
    paddingHorizontal: space.xs,
  },
  section: {
    marginBottom: space.md,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: space.xs + 2,
  },
  chipRow: {
    flexDirection: 'row',
    gap: space.xs + 2,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: space.sm + 4,
    paddingVertical: space.xs + 3,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActivePayer: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipActiveReceiver: {
    backgroundColor: colors.credit,
    borderColor: colors.credit,
  },
  chipDisabled: {
    opacity: 0.4,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipTextDisabled: {
    color: colors.textSecondary,
  },
  amountLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.xs + 2,
  },
  fullDebtBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: space.xs + 4,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  fullDebtText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
  amountInputContainer: {
    marginBottom: 0,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: space.md,
  },
  dateSelectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  noteInputContainer: {
    marginBottom: 0,
  },
  footerRow: {
    flexDirection: 'row',
    gap: space.sm,
    paddingTop: space.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelBtn: {
    flex: 1,
  },
  submitBtn: {
    flex: 1.6,
  },
});
