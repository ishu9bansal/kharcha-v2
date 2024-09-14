import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import expensesReducer from './slices/expensesSlice';
import uiReducer from './slices/uiSlice';
import expenseServiceMiddleware from '../middleware/expenseServiceMiddleware';

const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: true,
  }).concat(expenseServiceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type SliceActions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer A ? A : never;
}[keyof T]

export default store;
