import React, { FC, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Check,
  Database,
  FileCode,
  FileSpreadsheet,
  Share2,
  User,
  Users,
  X,
} from 'lucide-react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { radius, space, useAppTheme } from '@/theme';
import { ExportFormat, ExportScope, formatDate } from '@/utils';

type Props = {
  visible: boolean;
  onClose: () => void;
  onExport: (scope: ExportScope, format: ExportFormat) => void;
  personalCount: number;
  groupCount: number;
  exporting?: boolean;
};

export const ExportDataModal: FC<Props> = ({
  visible,
  onClose,
  onExport,
  personalCount,
  groupCount,
  exporting = false,
}) => {
  const { colors: themeColors, isDark } = useAppTheme();
  const [selectedScope, setSelectedScope] = useState<ExportScope>('personal');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');

  const todayStr = formatDate(Date.now());
  const previewFilename =
    selectedFormat === 'json'
      ? `equisplit_${selectedScope}_backup_${todayStr}.json`
      : `equisplit_${selectedScope}_expenses_${todayStr}.csv`;

  const handleExport = () => {
    onExport(selectedScope, selectedFormat);
  };

  const scopeOptions: Array<{
    id: ExportScope;
    title: string;
    subtitle: string;
    badge: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'personal',
      title: 'Personal Expenses',
      subtitle: 'Individual spending and income records',
      badge: `${personalCount} records`,
      icon: <User size={18} color={themeColors.primary} />,
    },
    {
      id: 'group',
      title: 'Group Expenses',
      subtitle: 'Shared bills, split contributions and settlements',
      badge: `${groupCount} records`,
      icon: <Users size={18} color="#38BDF8" />,
    },
    {
      id: 'complete',
      title: 'Complete Backup',
      subtitle: 'All members, categories, and all transactions',
      badge: `${personalCount + groupCount} total`,
      icon: <Database size={18} color="#A78BFA" />,
    },
  ];

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
                      { backgroundColor: themeColors.primaryLight },
                    ]}
                  >
                    <Share2 size={20} color={themeColors.primary} />
                  </View>
                  <View>
                    <AppText
                      style={[styles.title, { color: themeColors.textPrimary }]}
                    >
                      {'Export Data'}
                    </AppText>
                    <AppText
                      style={[
                        styles.subtitle,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      {'Export records to CSV or structured JSON'}
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

              <ScrollView
                style={styles.scrollArea}
                showsVerticalScrollIndicator={false}
              >
                {/* 1. Scope Selection */}
                <AppText
                  style={[
                    styles.sectionHeader,
                    { color: themeColors.textSecondary },
                  ]}
                >
                  {'1. SELECT DATA SCOPE'}
                </AppText>

                <View style={styles.scopeList}>
                  {scopeOptions.map(option => {
                    const isSelected = selectedScope === option.id;
                    return (
                      <Pressable
                        key={option.id}
                        onPress={() => setSelectedScope(option.id)}
                        style={[
                          styles.scopeCard,
                          {
                            backgroundColor: isSelected
                              ? isDark
                                ? 'rgba(99, 102, 241, 0.12)'
                                : 'rgba(99, 102, 241, 0.08)'
                              : themeColors.surfaceAlt,
                            borderColor: isSelected
                              ? themeColors.primary
                              : themeColors.border,
                          },
                        ]}
                      >
                        <View style={styles.scopeCardLeft}>
                          <View
                            style={[
                              styles.scopeIconContainer,
                              { backgroundColor: themeColors.surface },
                            ]}
                          >
                            {option.icon}
                          </View>
                          <View style={styles.scopeTextCol}>
                            <View style={styles.scopeTitleRow}>
                              <AppText
                                style={[
                                  styles.scopeTitle,
                                  { color: themeColors.textPrimary },
                                ]}
                              >
                                {option.title}
                              </AppText>
                              <View
                                style={[
                                  styles.scopeBadge,
                                  {
                                    backgroundColor: isSelected
                                      ? themeColors.primaryLight
                                      : isDark
                                      ? 'rgba(255, 255, 255, 0.06)'
                                      : 'rgba(0, 0, 0, 0.04)',
                                    borderColor: isSelected
                                      ? themeColors.primary
                                      : themeColors.border,
                                  },
                                ]}
                              >
                                <AppText
                                  style={[
                                    styles.scopeBadgeText,
                                    {
                                      color: isSelected
                                        ? themeColors.primary
                                        : themeColors.textSecondary,
                                    },
                                  ]}
                                >
                                  {option.badge}
                                </AppText>
                              </View>
                            </View>
                            <AppText
                              style={[
                                styles.scopeSubtitle,
                                { color: themeColors.textSecondary },
                              ]}
                            >
                              {option.subtitle}
                            </AppText>
                          </View>
                        </View>

                        <View
                          style={[
                            styles.radioCircle,
                            { borderColor: themeColors.border },
                            isSelected && {
                              borderColor: themeColors.primary,
                              backgroundColor: themeColors.primary,
                            },
                          ]}
                        >
                          {isSelected && <Check size={12} color="#FFFFFF" />}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>

                {/* 2. Format Selection */}
                <AppText
                  style={[
                    styles.sectionHeader,
                    { color: themeColors.textSecondary, marginTop: space.md },
                  ]}
                >
                  {'2. CHOOSE FORMAT'}
                </AppText>

                <View style={styles.formatRow}>
                  {/* CSV Option */}
                  <Pressable
                    onPress={() => setSelectedFormat('csv')}
                    style={[
                      styles.formatCard,
                      {
                        backgroundColor:
                          selectedFormat === 'csv'
                            ? isDark
                              ? 'rgba(99, 102, 241, 0.12)'
                              : 'rgba(99, 102, 241, 0.08)'
                            : themeColors.surfaceAlt,
                        borderColor:
                          selectedFormat === 'csv'
                            ? themeColors.primary
                            : themeColors.border,
                      },
                    ]}
                  >
                    <View style={styles.formatHeader}>
                      <FileSpreadsheet
                        size={22}
                        color={
                          selectedFormat === 'csv'
                            ? themeColors.primary
                            : themeColors.textSecondary
                        }
                      />
                      <View
                        style={[
                          styles.radioCircleSmall,
                          { borderColor: themeColors.border },
                          selectedFormat === 'csv' && {
                            borderColor: themeColors.primary,
                            backgroundColor: themeColors.primary,
                          },
                        ]}
                      >
                        {selectedFormat === 'csv' && (
                          <Check size={10} color="#FFFFFF" />
                        )}
                      </View>
                    </View>
                    <AppText
                      style={[
                        styles.formatTitle,
                        { color: themeColors.textPrimary },
                      ]}
                    >
                      {'CSV (Excel)'}
                    </AppText>
                    <AppText
                      style={[
                        styles.formatDesc,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      {'Spreadsheet table format'}
                    </AppText>
                  </Pressable>

                  {/* JSON Option */}
                  <Pressable
                    onPress={() => setSelectedFormat('json')}
                    style={[
                      styles.formatCard,
                      {
                        backgroundColor:
                          selectedFormat === 'json'
                            ? isDark
                              ? 'rgba(99, 102, 241, 0.12)'
                              : 'rgba(99, 102, 241, 0.08)'
                            : themeColors.surfaceAlt,
                        borderColor:
                          selectedFormat === 'json'
                            ? themeColors.primary
                            : themeColors.border,
                      },
                    ]}
                  >
                    <View style={styles.formatHeader}>
                      <FileCode
                        size={22}
                        color={
                          selectedFormat === 'json'
                            ? themeColors.primary
                            : themeColors.textSecondary
                        }
                      />
                      <View
                        style={[
                          styles.radioCircleSmall,
                          { borderColor: themeColors.border },
                          selectedFormat === 'json' && {
                            borderColor: themeColors.primary,
                            backgroundColor: themeColors.primary,
                          },
                        ]}
                      >
                        {selectedFormat === 'json' && (
                          <Check size={10} color="#FFFFFF" />
                        )}
                      </View>
                    </View>
                    <AppText
                      style={[
                        styles.formatTitle,
                        { color: themeColors.textPrimary },
                      ]}
                    >
                      {'JSON Backup'}
                    </AppText>
                    <AppText
                      style={[
                        styles.formatDesc,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      {'Full structured data format'}
                    </AppText>
                  </Pressable>
                </View>

                {/* Preview File Details */}
                <View
                  style={[
                    styles.previewContainer,
                    {
                      backgroundColor: themeColors.surfaceAlt,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <AppText
                    style={[
                      styles.previewLabel,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    {'Target file:'}
                  </AppText>
                  <AppText
                    style={[
                      styles.previewFilename,
                      { color: themeColors.primary },
                    ]}
                    numberOfLines={1}
                  >
                    {previewFilename}
                  </AppText>
                </View>
              </ScrollView>

              {/* Actions Footer */}
              <View
                style={[styles.footer, { borderTopColor: themeColors.border }]}
              >
                <AppButton
                  label="Cancel"
                  variant="ghost"
                  onPress={onClose}
                  disabled={exporting}
                  style={styles.cancelButton}
                />
                <AppButton
                  label={exporting ? 'Sharing...' : 'Export & Share'}
                  variant="primary"
                  loading={exporting}
                  onPress={handleExport}
                  style={styles.exportButton}
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: space.md,
  },
  content: {
    width: '100%',
    maxHeight: '90%',
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm + 2,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: space.xs,
  },
  scrollArea: {
    paddingHorizontal: space.lg,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: space.sm,
  },
  scopeList: {
    gap: space.sm,
  },
  scopeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: space.sm + 4,
    borderRadius: radius.lg,
    borderWidth: 1.5,
  },
  scopeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm + 2,
    flex: 1,
    paddingRight: space.xs,
  },
  scopeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scopeTextCol: {
    flex: 1,
    gap: 2,
  },
  scopeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 2,
  },
  scopeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  scopeBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  scopeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  scopeSubtitle: {
    fontSize: 11,
    lineHeight: 15,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatRow: {
    flexDirection: 'row',
    gap: space.sm,
  },
  formatCard: {
    flex: 1,
    padding: space.md,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    gap: 4,
  },
  formatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  radioCircleSmall: {
    width: 18,
    height: 18,
    borderRadius: radius.full,
    borderWidth: 1.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formatTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  formatDesc: {
    fontSize: 11,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: space.md,
    marginBottom: space.lg,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  previewFilename: {
    fontSize: 11,
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cancelButton: {
    flex: 1,
  },
  exportButton: {
    flex: 1.5,
  },
});
