// src/services/LocalStorageService.ts
import { IExpenseService } from './IExpenseService';
import { Expense } from '../types/Expense';
import { LocalStorageClient } from '../clients/LocalStorageClient';

export class LocalStorageService implements IExpenseService {
  private static instance: LocalStorageService;

  private client: LocalStorageClient;

  private constructor() {
    this.client = new LocalStorageClient(localStorage);
  }

  public static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  async getExpenses(): Promise<Expense[]> {
    return this.client.getExpensesFromLocalStorage();
  }

  async addExpense(expense: Expense): Promise<void> {
    const expenses = await this.getExpenses();
    expenses.push(expense);
    this.client.saveExpensesToLocalStorage(expenses);
  }

  async updateExpense(index: number, expense: Expense): Promise<void> {
    const expenses = await this.getExpenses();
    expenses[index] = expense;
    this.client.saveExpensesToLocalStorage(expenses);
  }

  async deleteExpense(index: number): Promise<void> {
    const expenses = await this.getExpenses();
    expenses.splice(index, 1);
    this.client.saveExpensesToLocalStorage(expenses);
  }
}
