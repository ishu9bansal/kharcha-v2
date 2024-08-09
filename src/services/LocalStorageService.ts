// src/services/LocalStorageService.ts
import { IExpenseService } from './IExpenseService';
import { Expense } from '../types/Expense';
import { getExpensesFromLocalStorage, saveExpensesToLocalStorage } from '../utils/localStorageHelpers';

export class LocalStorageService implements IExpenseService {
  private static instance: LocalStorageService;

  private constructor() {}

  public static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  async getExpenses(): Promise<Expense[]> {
    return getExpensesFromLocalStorage();
  }

  async addExpense(expense: Expense): Promise<void> {
    const expenses = await this.getExpenses();
    expenses.push(expense);
    saveExpensesToLocalStorage(expenses);
  }

  async updateExpense(index: number, expense: Expense): Promise<void> {
    const expenses = await this.getExpenses();
    expenses[index] = expense;
    saveExpensesToLocalStorage(expenses);
  }

  async deleteExpense(index: number): Promise<void> {
    const expenses = await this.getExpenses();
    expenses.splice(index, 1);
    saveExpensesToLocalStorage(expenses);
  }
}
