import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DEFAULT_CURRENCY_CODE } from '@/config/currency.config';

const CURRENCY_STORAGE_KEY = '@equisplit_currency_code_v1';

export type CurrencyState = {
  selectedCurrencyCode: string;
};

const initialState: CurrencyState = {
  selectedCurrencyCode: DEFAULT_CURRENCY_CODE,
};

export const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrencyCode: (state, action: PayloadAction<string>) => {
      const code = action.payload.toUpperCase();
      state.selectedCurrencyCode = code;
      AsyncStorage.setItem(CURRENCY_STORAGE_KEY, code).catch(err => {
        console.warn('[Currency] Failed to persist currency code:', err);
      });
    },
  },
});

export const { setCurrencyCode } = currencySlice.actions;

export async function loadPersistedCurrencyCode(): Promise<string | null> {
  try {
    const val = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
    if (val && typeof val === 'string') {
      return val.trim().toUpperCase();
    }
  } catch {
    // Ignore error
  }
  return null;
}

export default currencySlice.reducer;
