import { useCallback, useMemo, useRef, useState } from 'react';
import { Share } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import switchTheme from 'react-native-theme-switch-animation';

import {
  clearAllTransactions,
  setPrimaryMember as setPrimaryMemberDb,
} from '@/services/database';
import { showSuccessToast } from '@/services/toast/toast.service';
import { setCurrencyCode } from '@/store/currencySlice';
import { setExpenses } from '@/store/expenseSlice';
import { setPrimaryMemberId } from '@/store/memberSlice';
import { setPersonalExpenses } from '@/store/personalExpenseSlice';
import { RootState } from '@/store/store';
import { toggleTheme } from '@/store/themeSlice';
import { usePreferences } from '@/hooks';
import {
  ExportFormat,
  ExportScope,
  findCurrency,
  generateBalanceSummaryText,
  generateExportData,
  shareExportedData,
} from '@/utils';

export function useSettingsScreen() {
  const dispatch = useDispatch();
  const { trackOutOfPocket, setTrackOutOfPocket } = usePreferences();

  const members = useSelector((s: RootState) => s.members.members);
  const categories = useSelector((s: RootState) => s.categories.categories);
  const expenses = useSelector((s: RootState) => s.expenses.expenses);
  const personalExpenses = useSelector(
    (s: RootState) => s.personalExpenses.personalExpenses,
  );
  const themeMode = useSelector((s: RootState) => s.theme?.mode ?? 'dark');
  const isDark = themeMode === 'dark';

  const isSwitchingRef = useRef(false);

  const primaryMember = useMemo(
    () => members.find(m => m.isPrimary),
    [members],
  );

  const selectedCurrencyCode = useSelector(
    (s: RootState) => s.currency?.selectedCurrencyCode ?? 'INR',
  );
  const selectedCurrency = useMemo(
    () => findCurrency(selectedCurrencyCode),
    [selectedCurrencyCode],
  );

  const [switchModalVisible, setSwitchModalVisible] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [categoryManagerVisible, setCategoryManagerVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [clearDialogVisible, setClearDialogVisible] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);

  const handleSelectPrimary = useCallback(
    async (memberId: string) => {
      setSwitching(true);
      try {
        await setPrimaryMemberDb(memberId);
        dispatch(setPrimaryMemberId(memberId));
        const newPrimary = members.find(m => m.id === memberId);
        showSuccessToast(
          `Switched active profile to ${newPrimary?.name ?? 'selected member'}`,
        );
        setSwitchModalVisible(false);
      } finally {
        setSwitching(false);
      }
    },
    [members, dispatch],
  );

  const handleToggleTheme = useCallback(
    (_val?: boolean, coords?: { cx: number; cy: number }) => {
      if (isSwitchingRef.current) return;
      isSwitchingRef.current = true;

      switchTheme({
        switchThemeFunction: () => {
          dispatch(toggleTheme());
        },
        animationConfig: {
          type: 'circular',
          duration: 750,
          startingPoint: coords ?? {
            cxRatio: 0.88,
            cyRatio: 0.28,
          },
        },
      });

      setTimeout(() => {
        isSwitchingRef.current = false;
      }, 850);
    },
    [dispatch],
  );

  const handleExport = useCallback(
    async (scope: ExportScope, format: ExportFormat) => {
      setExporting(true);
      try {
        const result = generateExportData(
          scope,
          format,
          {
            members,
            categories,
            expenses,
            personalExpenses,
          },
          selectedCurrency.symbol,
          selectedCurrency.code,
        );
        await shareExportedData(result);
        showSuccessToast('Export generated and ready to share');
        setExportModalVisible(false);
      } catch (err) {
        console.error('[Export] Failed to export data:', err);
      } finally {
        setExporting(false);
      }
    },
    [members, categories, expenses, personalExpenses, selectedCurrency],
  );

  const handleShareBalances = useCallback(async () => {
    if (members.length === 0) {
      showSuccessToast('No group members to share balances for.');
      return;
    }
    try {
      const message = generateBalanceSummaryText(
        members,
        expenses,
        new Date(),
        selectedCurrency.symbol,
      );
      await Share.share({
        title: 'EquiSplit Group Balance Summary',
        message,
      });
    } catch {
      // User cancelled share dialog
    }
  }, [members, expenses, selectedCurrency.symbol]);

  const handleConfirmClearData = useCallback(async () => {
    setClearing(true);
    try {
      await clearAllTransactions();
      dispatch(setExpenses([]));
      dispatch(setPersonalExpenses([]));
      showSuccessToast('Transaction histories cleared successfully');
      setClearDialogVisible(false);
    } catch (err) {
      console.error('[Settings] Failed to clear transactions:', err);
    } finally {
      setClearing(false);
    }
  }, [dispatch]);

  const handleSelectCurrency = useCallback(
    (currencyCode: string) => {
      dispatch(setCurrencyCode(currencyCode));
      const curr = findCurrency(currencyCode);
      showSuccessToast(`Currency updated to ${curr.name} (${curr.symbol})`);
      setCurrencyModalVisible(false);
    },
    [dispatch],
  );

  const handleToggleTrackOutOfPocket = useCallback(
    (enabled: boolean) => {
      setTrackOutOfPocket(enabled);
    },
    [setTrackOutOfPocket],
  );

  return {
    members,
    categories,
    expenses,
    personalExpenses,
    primaryMember,
    themeMode,
    isDark,
    selectedCurrency,
    trackOutOfPocket,
    switchModalVisible,
    setSwitchModalVisible,
    categoryManagerVisible,
    setCategoryManagerVisible,
    exportModalVisible,
    setExportModalVisible,
    importModalVisible,
    setImportModalVisible,
    clearDialogVisible,
    setClearDialogVisible,
    currencyModalVisible,
    setCurrencyModalVisible,
    exporting,
    clearing,
    switching,
    handleSelectPrimary,
    handleToggleTheme,
    handleExport,
    handleShareBalances,
    handleConfirmClearData,
    handleSelectCurrency,
    handleToggleTrackOutOfPocket,
  };
}
