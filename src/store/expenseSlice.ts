import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Expense } from '@/types';

type ExpenseState = {
  expenses: Expense[];
};

const initialState: ExpenseState = {
  expenses: [],
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    setExpenses(state, action: PayloadAction<Expense[]>) {
      state.expenses = action.payload;
    },
    addExpense(state, action: PayloadAction<Expense>) {
      state.expenses.unshift(action.payload);
    },
    updateExpense(state, action: PayloadAction<Expense>) {
      const index = state.expenses.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    deleteExpense(state, action: PayloadAction<string>) {
      state.expenses = state.expenses.filter(e => e.id !== action.payload);
    },
  },
});

export const { setExpenses, addExpense, updateExpense, deleteExpense } =
  expenseSlice.actions;

export default expenseSlice.reducer;
