import React, { FC, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  AlertCircle,
  CheckCircle2,
  Database,
  FileCode,
  FileSpreadsheet,
  FileUp,
  ShieldCheck,
  User,
  Users,
  X,
} from 'lucide-react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppText } from '@/components/ui/AppText';
import { mergeImportedRecords } from '@/services/database';
import { showErrorToast, showSuccessToast } from '@/services/toast';
import { setCategories } from '@/store/categorySlice';
import { setExpenses } from '@/store/expenseSlice';
import { setMembers } from '@/store/memberSlice';
import { setPersonalExpenses } from '@/store/personalExpenseSlice';
import { RootState } from '@/store/store';
import { radius, space, useAppTheme } from '@/theme';
import {
  ParsedImportResult,
  parseImportContent,
  pickBackupFile,
  readTextFile,
} from '@/utils';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const ImportDataModal: FC<Props> = ({ visible, onClose }) => {
  const { colors: themeColors, isDark } = useAppTheme();
  const dispatch = useDispatch();

  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );

  const [picking, setPicking] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parsedResult, setParsedResult] = useState<ParsedImportResult | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleReset = () => {
    setParsedResult(null);
    setErrorMessage(null);
  };

  const handleModalClose = () => {
    if (importing) return;
    handleReset();
    onClose();
  };

  const handlePickFile = async () => {
    setErrorMessage(null);
    setPicking(true);
    try {
      const picked = await pickBackupFile();
      if (!picked) {
        // User cancelled picker
        setPicking(false);
        return;
      }

      const content = await readTextFile(picked.uri);
      if (!content || !content.trim()) {
        setErrorMessage('The selected file is empty.');
        setPicking(false);
        return;
      }

      const parsed = parseImportContent(content, picked.name, categories);

      const totalItems =
        parsed.summary.personalCount +
        parsed.summary.groupCount +
        parsed.summary.memberCount +
        parsed.summary.categoryCount;

      if (totalItems === 0) {
        setErrorMessage(
          'No valid expense, member, or category records were found in this file.',
        );
        setPicking(false);
        return;
      }

      setParsedResult(parsed);
    } catch (err: any) {
      console.error('[Import] Failed to parse file:', err);
      setErrorMessage(
        err?.message || 'Failed to read or parse the selected file.',
      );
    } finally {
      setPicking(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!parsedResult) return;
    setImporting(true);
    try {
      const result = await mergeImportedRecords(parsedResult.payload);

      // Immediately refresh Redux state with merged database records
      dispatch(setExpenses(result.expenses));
      dispatch(setPersonalExpenses(result.personalExpenses));
      dispatch(setMembers(result.members));
      dispatch(setCategories(result.categories));

      const totalAdded =
        result.summary.personalExpensesAdded +
        result.summary.expensesAdded +
        result.summary.membersAdded +
        result.summary.categoriesAdded;

      const totalSkipped =
        result.summary.personalExpensesSkipped +
        result.summary.expensesSkipped +
        result.summary.membersSkipped +
        result.summary.categoriesSkipped;

      showSuccessToast(
        `Import completed: ${totalAdded} added, ${totalSkipped} existing skipped`,
      );

      handleModalClose();
    } catch (err: any) {
      console.error('[Import] Failed to merge records:', err);
      showErrorToast(err?.message || 'Failed to merge imported data');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleModalClose}
    >
      <TouchableWithoutFeedback onPress={handleModalClose}>
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
                      { backgroundColor: 'rgba(99, 102, 241, 0.12)' },
                    ]}
                  >
                    <FileUp size={20} color={themeColors.primary} />
                  </View>
                  <View style={styles.headerTitles}>
                    <AppText
                      style={[styles.title, { color: themeColors.textPrimary }]}
                    >
                      {'Import Data'}
                    </AppText>
                    <AppText
                      style={[
                        styles.subtitle,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      {'Merge expenses from JSON or CSV backup'}
                    </AppText>
                  </View>
                </View>
                <Pressable
                  onPress={handleModalClose}
                  hitSlop={8}
                  style={styles.closeBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                  disabled={importing}
                >
                  <X size={20} color={themeColors.textSecondary} />
                </Pressable>
              </View>

              <ScrollView
                style={styles.scrollArea}
                showsVerticalScrollIndicator={false}
              >
                {/* Safe Merge Banner */}
                <View
                  style={[
                    styles.safeBanner,
                    {
                      backgroundColor: isDark
                        ? 'rgba(16, 185, 129, 0.12)'
                        : 'rgba(16, 185, 129, 0.08)',
                      borderColor: isDark
                        ? 'rgba(16, 185, 129, 0.25)'
                        : 'rgba(16, 185, 129, 0.2)',
                    },
                  ]}
                >
                  <ShieldCheck
                    size={20}
                    color="#10B981"
                    style={styles.bannerIcon}
                  />
                  <View style={styles.bannerTextCol}>
                    <AppText style={[styles.bannerTitle, { color: '#10B981' }]}>
                      {'Safe Merge Guarantee'}
                    </AppText>
                    <AppText
                      style={[
                        styles.bannerDesc,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      {
                        'Existing data will NOT be touched or overwritten. Only new records will be merged.'
                      }
                    </AppText>
                  </View>
                </View>

                {/* Error Banner if any */}
                {errorMessage && (
                  <View
                    style={[
                      styles.errorBanner,
                      {
                        backgroundColor: isDark
                          ? 'rgba(239, 68, 68, 0.12)'
                          : 'rgba(239, 68, 68, 0.08)',
                        borderColor: isDark
                          ? 'rgba(239, 68, 68, 0.25)'
                          : 'rgba(239, 68, 68, 0.2)',
                      },
                    ]}
                  >
                    <AlertCircle
                      size={18}
                      color={themeColors.debt}
                      style={styles.bannerIcon}
                    />
                    <AppText
                      style={[styles.errorText, { color: themeColors.debt }]}
                    >
                      {errorMessage}
                    </AppText>
                  </View>
                )}

                {/* State A: File not selected yet */}
                {!parsedResult ? (
                  <View style={styles.pickSection}>
                    <AppText
                      style={[
                        styles.sectionHeader,
                        { color: themeColors.textSecondary },
                      ]}
                    >
                      {'SUPPORTED FILE FORMATS'}
                    </AppText>

                    <View style={styles.formatList}>
                      <View
                        style={[
                          styles.formatCard,
                          {
                            backgroundColor: themeColors.surfaceAlt,
                            borderColor: themeColors.border,
                          },
                        ]}
                      >
                        <FileCode size={22} color={themeColors.primary} />
                        <View style={styles.formatTextCol}>
                          <AppText
                            style={[
                              styles.formatName,
                              { color: themeColors.textPrimary },
                            ]}
                          >
                            {'JSON Backup (.json)'}
                          </AppText>
                          <AppText
                            style={[
                              styles.formatDesc,
                              { color: themeColors.textSecondary },
                            ]}
                          >
                            {
                              'Complete EquiSplit backup with members & categories'
                            }
                          </AppText>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.formatCard,
                          {
                            backgroundColor: themeColors.surfaceAlt,
                            borderColor: themeColors.border,
                          },
                        ]}
                      >
                        <FileSpreadsheet size={22} color="#34D399" />
                        <View style={styles.formatTextCol}>
                          <AppText
                            style={[
                              styles.formatName,
                              { color: themeColors.textPrimary },
                            ]}
                          >
                            {'CSV Spreadsheet (.csv)'}
                          </AppText>
                          <AppText
                            style={[
                              styles.formatDesc,
                              { color: themeColors.textSecondary },
                            ]}
                          >
                            {'Personal or Group table exported from EquiSplit'}
                          </AppText>
                        </View>
                      </View>
                    </View>

                    <View style={styles.pickButtonWrap}>
                      <AppButton
                        label={
                          picking ? 'Reading File...' : 'Select Backup File'
                        }
                        loading={picking}
                        variant="primary"
                        onPress={handlePickFile}
                        style={styles.selectFileBtn}
                      />
                    </View>
                  </View>
                ) : (
                  /* State B: File picked and parsed, ready for preview and confirmation */
                  <View style={styles.previewSection}>
                    {/* Selected File Card */}
                    <View
                      style={[
                        styles.fileCard,
                        {
                          backgroundColor: themeColors.surfaceAlt,
                          borderColor: themeColors.border,
                        },
                      ]}
                    >
                      <View style={styles.fileCardHeader}>
                        {parsedResult.format === 'json' ? (
                          <FileCode size={20} color={themeColors.primary} />
                        ) : (
                          <FileSpreadsheet size={20} color="#34D399" />
                        )}
                        <AppText
                          style={[
                            styles.fileName,
                            { color: themeColors.textPrimary },
                          ]}
                          numberOfLines={1}
                        >
                          {parsedResult.filename}
                        </AppText>
                        <View
                          style={[
                            styles.formatBadge,
                            {
                              backgroundColor:
                                parsedResult.format === 'json'
                                  ? 'rgba(99, 102, 241, 0.15)'
                                  : 'rgba(52, 211, 153, 0.15)',
                            },
                          ]}
                        >
                          <AppText
                            style={[
                              styles.formatBadgeText,
                              {
                                color:
                                  parsedResult.format === 'json'
                                    ? themeColors.primary
                                    : '#10B981',
                              },
                            ]}
                          >
                            {parsedResult.format.toUpperCase()}
                          </AppText>
                        </View>
                      </View>
                    </View>

                    <AppText
                      style={[
                        styles.sectionHeader,
                        {
                          color: themeColors.textSecondary,
                          marginTop: space.md,
                        },
                      ]}
                    >
                      {'RECORDS FOUND IN FILE'}
                    </AppText>

                    {/* 2x2 Grid of Detected Records */}
                    <View style={styles.statsGrid}>
                      <View
                        style={[
                          styles.statCard,
                          {
                            backgroundColor: themeColors.surfaceAlt,
                            borderColor: themeColors.border,
                          },
                        ]}
                      >
                        <User size={18} color={themeColors.primary} />
                        <AppText
                          style={[
                            styles.statCount,
                            { color: themeColors.textPrimary },
                          ]}
                        >
                          {parsedResult.summary.personalCount}
                        </AppText>
                        <AppText
                          style={[
                            styles.statLabel,
                            { color: themeColors.textSecondary },
                          ]}
                        >
                          {'Personal Expenses'}
                        </AppText>
                      </View>

                      <View
                        style={[
                          styles.statCard,
                          {
                            backgroundColor: themeColors.surfaceAlt,
                            borderColor: themeColors.border,
                          },
                        ]}
                      >
                        <Users size={18} color="#38BDF8" />
                        <AppText
                          style={[
                            styles.statCount,
                            { color: themeColors.textPrimary },
                          ]}
                        >
                          {parsedResult.summary.groupCount}
                        </AppText>
                        <AppText
                          style={[
                            styles.statLabel,
                            { color: themeColors.textSecondary },
                          ]}
                        >
                          {'Group Expenses'}
                        </AppText>
                      </View>

                      <View
                        style={[
                          styles.statCard,
                          {
                            backgroundColor: themeColors.surfaceAlt,
                            borderColor: themeColors.border,
                          },
                        ]}
                      >
                        <Database size={18} color="#A78BFA" />
                        <AppText
                          style={[
                            styles.statCount,
                            { color: themeColors.textPrimary },
                          ]}
                        >
                          {parsedResult.summary.memberCount}
                        </AppText>
                        <AppText
                          style={[
                            styles.statLabel,
                            { color: themeColors.textSecondary },
                          ]}
                        >
                          {'Members'}
                        </AppText>
                      </View>

                      <View
                        style={[
                          styles.statCard,
                          {
                            backgroundColor: themeColors.surfaceAlt,
                            borderColor: themeColors.border,
                          },
                        ]}
                      >
                        <CheckCircle2 size={18} color="#34D399" />
                        <AppText
                          style={[
                            styles.statCount,
                            { color: themeColors.textPrimary },
                          ]}
                        >
                          {parsedResult.summary.categoryCount}
                        </AppText>
                        <AppText
                          style={[
                            styles.statLabel,
                            { color: themeColors.textSecondary },
                          ]}
                        >
                          {'Categories'}
                        </AppText>
                      </View>
                    </View>

                    {/* Merge Notice */}
                    <View
                      style={[
                        styles.infoRow,
                        {
                          backgroundColor: isDark
                            ? 'rgba(255, 255, 255, 0.04)'
                            : 'rgba(0, 0, 0, 0.02)',
                          borderColor: themeColors.border,
                        },
                      ]}
                    >
                      <AppText
                        style={[
                          styles.infoNoticeText,
                          { color: themeColors.textSecondary },
                        ]}
                      >
                        {
                          'Records matching existing IDs or identical amounts and dates will be skipped to prevent duplicates.'
                        }
                      </AppText>
                    </View>
                  </View>
                )}
              </ScrollView>

              {/* Actions Footer */}
              <View
                style={[styles.footer, { borderTopColor: themeColors.border }]}
              >
                {!parsedResult ? (
                  <AppButton
                    label="Cancel"
                    variant="ghost"
                    onPress={handleModalClose}
                    disabled={picking}
                    style={styles.fullWidthButton}
                  />
                ) : (
                  <>
                    <AppButton
                      label="Pick Different"
                      variant="ghost"
                      onPress={handleReset}
                      disabled={importing}
                      style={styles.cancelButton}
                    />
                    <AppButton
                      label={importing ? 'Merging...' : 'Import & Merge'}
                      variant="primary"
                      loading={importing}
                      onPress={handleConfirmImport}
                      style={styles.exportButton}
                    />
                  </>
                )}
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
    maxWidth: 480,
    maxHeight: '85%',
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
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
    flex: 1,
    marginRight: space.sm,
  },
  headerTitles: {
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: space.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
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
  safeBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: space.md,
  },
  bannerIcon: {
    marginRight: space.sm,
    marginTop: 2,
  },
  bannerTextCol: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  bannerDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: space.md,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: space.xs,
  },
  pickSection: {
    marginBottom: space.md,
  },
  formatList: {
    gap: space.xs,
    marginTop: space.xs,
    marginBottom: space.lg,
  },
  formatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  formatTextCol: {
    marginLeft: space.md,
    flex: 1,
  },
  formatName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  formatDesc: {
    fontSize: 11,
  },
  pickButtonWrap: {
    marginTop: space.xs,
  },
  selectFileBtn: {
    width: '100%',
  },
  previewSection: {
    marginBottom: space.md,
  },
  fileCard: {
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  fileCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  fileName: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  formatBadge: {
    paddingHorizontal: space.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  formatBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginTop: space.xs,
    marginBottom: space.md,
  },
  statCard: {
    width: '48%',
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  statCount: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: space.xs,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  infoRow: {
    padding: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  infoNoticeText: {
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  fullWidthButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
  exportButton: {
    flex: 1.5,
  },
});
