import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// import expensesReducer from './slices/expensesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // expenses: expensesReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: true,
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
