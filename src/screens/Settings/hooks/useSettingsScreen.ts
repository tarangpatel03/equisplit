import { useCallback, useEffect, useMemo, useState } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { executeThemeTransition } from '@/components/common';
import { setPrimaryMember as setPrimaryMemberDb } from '@/services/database';
import { showSuccessToast } from '@/services/toast/toast.service';
import { setPrimaryMemberId } from '@/store/memberSlice';
import { RootState } from '@/store/store';
import { toggleTheme } from '@/store/themeSlice';

export function useSettingsScreen() {
  const dispatch = useDispatch();

  const members = useSelector((s: RootState) => s.members.members);
  const categories = useSelector((s: RootState) => s.categories.categories);
  const themeMode = useSelector((s: RootState) => s.theme?.mode ?? 'dark');

  const [isSwitchingTheme, setIsSwitchingTheme] = useState(false);
  const [localThemeMode, setLocalThemeMode] = useState(themeMode);

  useEffect(() => {
    if (!isSwitchingTheme) {
      setLocalThemeMode(themeMode);
    }
  }, [themeMode, isSwitchingTheme]);

  const isDark = localThemeMode === 'dark';

  const primaryMember = useMemo(
    () => members.find(m => m.isPrimary),
    [members],
  );

  const [switchModalVisible, setSwitchModalVisible] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [categoryManagerVisible, setCategoryManagerVisible] = useState(false);

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

  const handleToggleTheme = useCallback(() => {
    if (isSwitchingTheme) return;

    const nextMode = localThemeMode === 'dark' ? 'light' : 'dark';
    setIsSwitchingTheme(true);
    setLocalThemeMode(nextMode);

    if (
      Platform.OS === 'android' &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    executeThemeTransition(nextMode, () => {
      dispatch(toggleTheme());
      setIsSwitchingTheme(false);
    });
  }, [localThemeMode, isSwitchingTheme, dispatch]);

  return {
    members,
    categories,
    primaryMember,
    themeMode,
    isDark,
    switchModalVisible,
    setSwitchModalVisible,
    categoryManagerVisible,
    setCategoryManagerVisible,
    switching,
    handleSelectPrimary,
    handleToggleTheme,
  };
}
