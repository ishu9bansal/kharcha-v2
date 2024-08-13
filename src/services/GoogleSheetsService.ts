// src/services/GoogleSheetsService.ts
import { IExpenseService } from './IExpenseService';
import { Expense } from '../types/Expense';
import { SessionManager } from './SessionManager';
import { UserSheetManager } from './UserSheetManager';
import {
  getGoogleSheetsClient,
  getExpensesFromSheet,
  addExpenseToSheet,
  updateExpenseInSheet,
  deleteExpenseFromSheet,
} from '../utils/googleSheetsHelper';

export class GoogleSheetsService implements IExpenseService {
  private static instance: GoogleSheetsService;

  private constructor() {}

  public static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  public async getExpenses(): Promise<Expense[]> {
    const userId = 'current-user-id'; // This would be dynamically set
    const accessToken = SessionManager.getInstance().getAccessToken(userId);
    const spreadsheetId = await UserSheetManager.getInstance().getOrCreateSheetId(userId);

    return getExpensesFromSheet(accessToken!, spreadsheetId);
  }

  public async addExpense(expense: Expense): Promise<void> {
    const userId = 'current-user-id';
    const accessToken = SessionManager.getInstance().getAccessToken(userId);
    const spreadsheetId = await UserSheetManager.getInstance().getOrCreateSheetId(userId);

    return addExpenseToSheet(accessToken!, spreadsheetId, expense);
  }

  public async updateExpense(index: number, expense: Expense): Promise<void> {
    const userId = 'current-user-id';
    const accessToken = SessionManager.getInstance().getAccessToken(userId);
    const spreadsheetId = await UserSheetManager.getInstance().getOrCreateSheetId(userId);

    return updateExpenseInSheet(accessToken!, spreadsheetId, index, expense);
  }

  public async deleteExpense(index: number): Promise<void> {
    const userId = 'current-user-id';
    const accessToken = SessionManager.getInstance().getAccessToken(userId);
    const spreadsheetId = await UserSheetManager.getInstance().getOrCreateSheetId(userId);

    return deleteExpenseFromSheet(accessToken!, spreadsheetId, index);
  }
}
