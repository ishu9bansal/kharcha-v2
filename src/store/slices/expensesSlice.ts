// src/store/slices/expensesSlice.ts
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Expense } from '../../types/Expense';
import { RootState, SliceActions } from '../store';

interface ExpensesState {
  list: Expense[];
  error: string | null;
}

const initialState: ExpensesState = {
  list: [],
  error: null,
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action: PayloadAction<Expense>) => {
      // Optimistically add the expense
      state.list.push(action.payload);
    },

    revertAddExpense: (state) => {
      // TODO: can this be improved to habdle case of concurency
      // Delete lastly added expense
      state.list.pop();
    },

    updateExpense: (state, action: PayloadAction<{ index: number, expense: Expense}>) => {
      const { index, expense } = action.payload;
      state.list[index] = expense;
    },

    revertUpdateExpense: (state, action: PayloadAction<{ index: number, expense: Expense}>) => {
      const { index, expense } = action.payload;
      state.list[index] = expense;
    },

    deleteExpense: (state, action: PayloadAction<number>) => {
      // Optimistically delete the expense
      state.list.splice(action.payload, 1);
    },

    revertDeleteExpense: (state, action: PayloadAction<{ index: number, expense: Expense}>) => {
      const { index, expense } = action.payload;
      state.list.splice(index, 0, expense);
    },

    fetchExpenses: (state) => {},

    setExpensesList: (state, action: PayloadAction<Expense[]>) => {
      state.list = action.payload;
    },
  },
});

export const {
  addExpense,
  updateExpense,
  deleteExpense,
  fetchExpenses,
  revertAddExpense,
  revertUpdateExpense,
  revertDeleteExpense,
  setExpensesList,
} = expensesSlice.actions;
const selectExpensesState = (state: RootState) => state.expenses;
export const selectExpenses = createSelector([selectExpensesState], expenses => expenses.list);
export type ExpenseActionTypes = SliceActions<typeof expensesSlice.actions>;

export default expensesSlice.reducer;
