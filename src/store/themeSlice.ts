import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { setGlobalThemeColors } from '@/theme/colors';

const THEME_STORAGE_KEY = '@equisplit_theme_mode_v1';

export type ThemeMode = 'dark' | 'light';

type ThemeState = {
  mode: ThemeMode;
};

const initialState: ThemeState = {
  mode: 'dark',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      setGlobalThemeColors(action.payload);
      AsyncStorage.setItem(THEME_STORAGE_KEY, action.payload).catch(err => {
        console.warn('[Theme] Failed to persist theme mode:', err);
      });
    },
    toggleTheme: state => {
      const nextMode = state.mode === 'dark' ? 'light' : 'dark';
      state.mode = nextMode;
      setGlobalThemeColors(nextMode);
      AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode).catch(err => {
        console.warn('[Theme] Failed to persist theme mode:', err);
      });
    },
  },
});

export const { setThemeMode, toggleTheme } = themeSlice.actions;

export async function loadPersistedThemeMode(): Promise<ThemeMode | null> {
  try {
    const val = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (val === 'light' || val === 'dark') {
      return val;
    }
  } catch {
    // Ignore error
  }
  return null;
}

export default themeSlice.reducer;
