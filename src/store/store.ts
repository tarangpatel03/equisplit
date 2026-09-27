import { configureStore } from '@reduxjs/toolkit';

import categoryReducer from './categorySlice';
import expenseReducer from './expenseSlice';
import memberReducer from './memberSlice';

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    expenses: expenseReducer,
    members: memberReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
