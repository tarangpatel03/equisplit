import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Check, Coins, Search, X } from 'lucide-react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';
import { AppText } from '@/components/ui/AppText';
import {
  CurrencyInfo,
  SUPPORTED_CURRENCIES,
} from '@/config/currency.config';
import { colors, radius, space, useAppTheme } from '@/theme';

type Props = {
  visible: boolean;
  currentCurrencyCode: string;
  onSelect: (currencyCode: string) => void;
  onClose: () => void;
};

export const CurrencyPickerModal: FC<Props> = ({
  visible,
  currentCurrencyCode,
  onSelect,
  onClose,
}) => {
  const { colors: themeColors } = useAppTheme();
  const [selectedCode, setSelectedCode] = useState<string>(currentCurrencyCode);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (visible) {
      setSelectedCode(currentCurrencyCode);
      setSearchQuery('');
    }
  }, [visible, currentCurrencyCode]);

  const filteredCurrencies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SUPPORTED_CURRENCIES;
    return SUPPORTED_CURRENCIES.filter(
      (c: CurrencyInfo) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const handleConfirm = () => {
    if (selectedCode && selectedCode !== currentCurrencyCode) {
      onSelect(selectedCode);
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
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: themeColors.goldLight },
                    ]}
                  >
                    <Coins size={20} color={themeColors.warning} />
                  </View>
                  <View>
                    <AppText
                      style={[styles.title, { color: themeColors.textPrimary }]}
                    >
                      {'Select Currency'}
                    </AppText>
                    <AppText
                      style={[
                        styles.subtitle,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      {'Choose your preferred display currency'}
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

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <AppInput
                  placeholder="Search currency by name or code..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  prefix={
                    <View style={styles.searchIconWrapper}>
                      <Search size={16} color={themeColors.textSecondary} />
                    </View>
                  }
                  clearButtonMode="while-editing"
                />
              </View>

              {/* Currencies List */}
              <ScrollView
                style={styles.list}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {filteredCurrencies.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <AppText
                      style={[
                        styles.emptyText,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      {'No currencies match your search'}
                    </AppText>
                  </View>
                ) : (
                  filteredCurrencies.map((c: CurrencyInfo) => {
                    const isSelected = selectedCode === c.code;
                    const isCurrent = currentCurrencyCode === c.code;

                    return (
                      <Pressable
                        key={c.code}
                        style={[
                          styles.currencyRow,
                          { borderColor: themeColors.border },
                          isSelected && [
                            styles.currencyRowSelected,
                            {
                              backgroundColor: themeColors.primaryLight,
                              borderColor: themeColors.primary,
                            },
                          ],
                        ]}
                        onPress={() => setSelectedCode(c.code)}
                      >
                        {/* Currency Symbol Badge */}
                        <View
                          style={[
                            styles.symbolBadge,
                            {
                              backgroundColor: isSelected
                                ? themeColors.primary
                                : themeColors.surfaceAlt,
                              borderColor: themeColors.border,
                            },
                          ]}
                        >
                          <AppText
                            style={[
                              styles.symbolText,
                              {
                                color: isSelected
                                  ? colors.textOnPrimary
                                  : themeColors.textPrimary,
                              },
                            ]}
                          >
                            {c.symbol}
                          </AppText>
                        </View>

                        {/* Currency Details */}
                        <View style={styles.currencyDetails}>
                          <View style={styles.codeRow}>
                            <AppText
                              style={[
                                styles.currencyCode,
                                { color: themeColors.textPrimary },
                              ]}
                            >
                              {c.code}
                            </AppText>
                            {isCurrent && (
                              <AppText
                                style={[
                                  styles.activeTag,
                                  { color: themeColors.primary },
                                ]}
                              >
                                {'· Active'}
                              </AppText>
                            )}
                          </View>
                          <AppText
                            style={[
                              styles.currencyName,
                              { color: themeColors.textSecondary },
                            ]}
                          >
                            {c.name}
                          </AppText>
                        </View>

                        {/* Radio Check Circle */}
                        <View
                          style={[
                            styles.radio,
                            { borderColor: themeColors.border },
                            isSelected && {
                              backgroundColor: themeColors.primary,
                              borderColor: themeColors.primary,
                            },
                          ]}
                        >
                          {isSelected && (
                            <Check
                              size={14}
                              color={colors.textOnPrimary}
                              strokeWidth={3}
                            />
                          )}
                        </View>
                      </Pressable>
                    );
                  })
                )}
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
                  label="Save Currency"
                  variant="primary"
                  disabled={selectedCode === currentCurrencyCode}
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
    borderRadius: radius.xl,
    borderWidth: 1,
    width: '100%',
    maxHeight: '82%',
    padding: space.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: space.sm,
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
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: space.xs,
  },
  searchContainer: {
    marginTop: space.xs,
    marginBottom: space.sm,
  },
  searchIconWrapper: {
    paddingLeft: space.sm,
    paddingRight: space.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    maxHeight: 320,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: space.xs,
    gap: space.sm,
  },
  currencyRowSelected: {
    borderWidth: 1.5,
  },
  symbolBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  symbolText: {
    fontSize: 14,
    fontWeight: '700',
  },
  currencyDetails: {
    flex: 1,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  currencyCode: {
    fontSize: 14,
    fontWeight: '700',
  },
  activeTag: {
    fontSize: 12,
    fontWeight: '600',
  },
  currencyName: {
    fontSize: 12,
    marginTop: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: space.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: space.sm,
    marginTop: space.md,
  },
  cancelBtn: {
    flex: 1,
  },
  confirmBtn: {
    flex: 1.5,
  },
});
