import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const PREFERENCES_STORAGE_KEY = '@equisplit_preferences_v1';

export type PreferencesState = {
  trackOutOfPocket: boolean;
};

const initialState: PreferencesState = {
  trackOutOfPocket: false,
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTrackOutOfPocket: (state, action: PayloadAction<boolean>) => {
      state.trackOutOfPocket = action.payload;
      AsyncStorage.setItem(
        PREFERENCES_STORAGE_KEY,
        JSON.stringify({ trackOutOfPocket: action.payload }),
      ).catch(err => {
        console.warn('[Preferences] Failed to persist preferences:', err);
      });
    },
  },
});

export const { setTrackOutOfPocket } = preferencesSlice.actions;

export async function loadPersistedPreferences(): Promise<{
  trackOutOfPocket: boolean;
} | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed?.trackOutOfPocket === 'boolean') {
        return { trackOutOfPocket: parsed.trackOutOfPocket };
      }
    }
  } catch {
    // Ignore error
  }
  return null;
}

export default preferencesSlice.reducer;
