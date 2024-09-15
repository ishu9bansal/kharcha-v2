import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import expensesReducer from './slices/expensesSlice';
import uiReducer from './slices/uiSlice';
import expenseMiddleware from '../middleware/expenseSyncMiddleware';
// import expenseMiddleware from '../middleware/expenseServiceMiddleware';  // deprecated, less stable wrt concurrent changes

const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: true,
  }).concat(expenseMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type SliceActions<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer A ? A : never;
}[keyof T]

export default store;
