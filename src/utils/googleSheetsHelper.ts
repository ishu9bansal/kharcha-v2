// src/utils/googleSheetsHelper.ts
import { google, sheets_v4 } from 'googleapis';
import { Expense } from '../types/Expense';

export function getGoogleSheetsClient(accessToken: string): sheets_v4.Sheets {
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: accessToken });
  return google.sheets({ version: 'v4', auth: oauth2Client });
}

export async function createNewSpreadsheet(accessToken: string): Promise<string> {
  const sheets = getGoogleSheetsClient(accessToken);
  const response = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: 'User Expenses',
      },
    },
  });
  return response.data.spreadsheetId!;
}

export async function getExpensesFromSheet(accessToken: string, spreadsheetId: string): Promise<Expense[]> {
  const sheets = getGoogleSheetsClient(accessToken);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `Sheet1!A2:H`,
  });

  return response.data.values?.map(row => ({
    date: row[0],
    amount: Number(row[1]),
    title: row[2],
    category: row[3],
    paymentMode: row[4],
    recurring: row[5] === 'TRUE',
    beneficiary: row[6],
    tags: row[7] ? row[7].split(',') : [],
  })) || [];
}

export async function addExpenseToSheet(accessToken: string, spreadsheetId: string, expense: Expense): Promise<void> {
  const sheets = getGoogleSheetsClient(accessToken);
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `Sheet1!A:H`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        [
          expense.date,
          expense.amount,
          expense.title,
          expense.category,
          expense.paymentMode,
          expense.recurring ? 'TRUE' : 'FALSE',
          expense.beneficiary,
          expense.tags.join(','),
        ],
      ],
    },
  });
}

export async function updateExpenseInSheet(accessToken: string, spreadsheetId: string, row: number, expense: Expense): Promise<void> {
  const sheets = getGoogleSheetsClient(accessToken);
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Sheet1!A${row + 2}:H${row + 2}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        [
          expense.date,
          expense.amount,
          expense.title,
          expense.category,
          expense.paymentMode,
          expense.recurring ? 'TRUE' : 'FALSE',
          expense.beneficiary,
          expense.tags.join(','),
        ],
      ],
    },
  });
}

export async function deleteExpenseFromSheet(accessToken: string, spreadsheetId: string, row: number): Promise<void> {
  const sheets = getGoogleSheetsClient(accessToken);
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `Sheet1!A${row + 2}:H${row + 2}`,
  });
}
