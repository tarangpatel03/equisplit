import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { PersonalExpense } from '@/types';

type PersonalExpenseState = {
  personalExpenses: PersonalExpense[];
  loading: boolean;
  error: string | null;
};

const initialState: PersonalExpenseState = {
  personalExpenses: [],
  loading: false,
  error: null,
};

const personalExpenseSlice = createSlice({
  name: 'personalExpenses',
  initialState,
  reducers: {
    setPersonalExpenses(state, action: PayloadAction<PersonalExpense[]>) {
      state.personalExpenses = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPersonalExpense(state, action: PayloadAction<PersonalExpense>) {
      state.personalExpenses.unshift(action.payload);
    },
    updatePersonalExpense(state, action: PayloadAction<PersonalExpense>) {
      const index = state.personalExpenses.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.personalExpenses[index] = action.payload;
      }
    },
    deletePersonalExpense(state, action: PayloadAction<string>) {
      state.personalExpenses = state.personalExpenses.filter(e => e.id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setPersonalExpenses,
  addPersonalExpense,
  updatePersonalExpense,
  deletePersonalExpense,
  setLoading,
  setError,
} = personalExpenseSlice.actions;

export default personalExpenseSlice.reducer;
