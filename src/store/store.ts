import { configureStore } from '@reduxjs/toolkit';

import categoryReducer from './categorySlice';
import currencyReducer from './currencySlice';
import expenseReducer from './expenseSlice';
import memberReducer from './memberSlice';
import personalExpenseReducer from './personalExpenseSlice';
import preferencesReducer from './preferencesSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    currency: currencyReducer,
    expenses: expenseReducer,
    members: memberReducer,
    personalExpenses: personalExpenseReducer,
    preferences: preferencesReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
