// src/services/GoogleSheetsService.ts
import { IExpenseService } from './IExpenseService';
import { Expense } from '../types/Expense';
import { useAuth } from '../context/AuthContext';
import {
  getGoogleSheetsClient,
  getExpensesFromSheet,
  addExpenseToSheet,
  updateExpenseInSheet,
  deleteExpenseFromSheet,
} from '../utils/googleSheetsHelper';

export class GoogleSheetsService implements IExpenseService {
  private static instance: GoogleSheetsService;
  private accessToken: string | null;
  private constructor() {
    this.accessToken = null;
  }

  public static getInstance(accessToken: string): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    GoogleSheetsService.instance.setAccessToken(accessToken);
    return GoogleSheetsService.instance;
  }

  public setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
  }

  private getAccessToken(): string | null {
    return this.accessToken;
  }

  public async getExpenses(): Promise<Expense[]> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }
    const spreadsheetId = await this.getOrCreateSheet();
    return getExpensesFromSheet(accessToken, spreadsheetId);
  }

  public async addExpense(expense: Expense): Promise<void> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }
    const spreadsheetId = await this.getOrCreateSheet();
    return addExpenseToSheet(accessToken, spreadsheetId, expense);
  }

  public async updateExpense(index: number, expense: Expense): Promise<void> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }
    const spreadsheetId = await this.getOrCreateSheet();
    return updateExpenseInSheet(accessToken, spreadsheetId, index, expense);
  }

  public async deleteExpense(index: number): Promise<void> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }
    const spreadsheetId = await this.getOrCreateSheet();
    return deleteExpenseFromSheet(accessToken, spreadsheetId, index);
  }

  private async getOrCreateSheet(): Promise<string> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token available');
    }
    return await getGoogleSheetsClient(accessToken).getOrCreateSheet();
  }
}
