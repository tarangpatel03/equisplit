import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { INITIAL_CATEGORIES } from '@/config';
import { ExpenseCategory } from '@/types';

type CategoryState = {
  categories: ExpenseCategory[];
};

const initialState: CategoryState = {
  categories: INITIAL_CATEGORIES,
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<ExpenseCategory[]>) {
      state.categories = action.payload;
    },
    addCategory(state, action: PayloadAction<ExpenseCategory>) {
      state.categories.push(action.payload);
    },
    updateCategory(state, action: PayloadAction<ExpenseCategory>) {
      const index = state.categories.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory(state, action: PayloadAction<string>) {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    },
  },
});

export const { setCategories, addCategory, updateCategory, deleteCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
