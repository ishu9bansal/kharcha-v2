import { Expense } from "../types/Expense";

// src/utils/localStorageHelpers.ts
export const getExpensesFromLocalStorage = (): Expense[] => {
    const expenses = localStorage.getItem('expenses');
    return expenses ? JSON.parse(expenses) : [];
  };
  
  export const saveExpensesToLocalStorage = (expenses: Expense[]) => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  };
  
  export const addExpenseToLocalStorage = (expense: Expense) => {
    const expenses = getExpensesFromLocalStorage();
    expenses.push(expense);
    saveExpensesToLocalStorage(expenses);
  };
  
  export const updateExpenseInLocalStorage = (index: number, updatedExpense: Expense) => {
    const expenses = getExpensesFromLocalStorage();
    expenses[index] = updatedExpense;
    saveExpensesToLocalStorage(expenses);
  };
  