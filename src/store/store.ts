import { configureStore } from '@reduxjs/toolkit';

import categoryReducer from './categorySlice';
import expenseReducer from './expenseSlice';
import memberReducer from './memberSlice';
import personalExpenseReducer from './personalExpenseSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    expenses: expenseReducer,
    members: memberReducer,
    personalExpenses: personalExpenseReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
