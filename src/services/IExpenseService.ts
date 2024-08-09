// src/services/IExpenseService.ts
import { Expense } from '../types/Expense';

export interface IExpenseService {
  getExpenses(): Promise<Expense[]>;
  addExpense(expense: Expense): Promise<void>;
  updateExpense(index: number, expense: Expense): Promise<void>;
  deleteExpense(index: number): Promise<void>;
}
