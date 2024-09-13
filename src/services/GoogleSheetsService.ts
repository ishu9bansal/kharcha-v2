// src/services/GoogleSheetsService.ts
import { IExpenseService } from './IExpenseService';
import { Expense } from '../types/Expense';
import { GoogleSheetsClient } from '../clients/GoogleSheetsClient';

export class GoogleSheetsService implements IExpenseService {
  private static instance: GoogleSheetsService | null = null;
  private client: GoogleSheetsClient;
  private constructor() {
    this.client = new GoogleSheetsClient();
  }

  public static getInstance(): GoogleSheetsService | null {
    return GoogleSheetsService.instance;
  }

  public static async initWithAccessToken(accessToken: string): Promise<void> {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    await GoogleSheetsService.instance.setAccessToken(accessToken);
  }

  public async setAccessToken(accessToken: string) {
    await this.client.initSetupWithAccessToken(accessToken);
  }

  public async getExpenses(): Promise<Expense[]> {
    const values = await this.client.getDataFromSheet();
    return values.splice(1).map(this.client.deserialize); // First row is the column names
  }

  public async addExpense(expense: Expense): Promise<void> {
    const row = this.client.serialize(expense);
    await this.client.appendRowsToSpreadsheet([row]);
  }

  public async updateExpense(index: number, expense: Expense): Promise<void> {
    const row = this.client.serialize(expense);
    await this.client.updateRowInSpreadsheet(index+2, row);
    // +1 for index is 0 based while sheets are 1 based 
    // +1 for first row being the column names
  }

  public async deleteExpense(index: number): Promise<void> {
    await this.client.deleteRowsFromSpreadsheet(index+1, 1);
    // Assuming Sheet1 is the first sheet hence pageIndex 0
    // index+1 for column names
  }
}
