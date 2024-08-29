// src/utils/googleSheetsHelper.ts
import axios from 'axios';
import { Expense } from '../types/Expense';

const sheetName = 'KharchaApp/ExpensesSheet';

export const getGoogleSheetsClient = (accessToken: string) => ({
  getOrCreateSheet: async (): Promise<string> => {
    const response = await axios.get('https://www.googleapis.com/drive/v3/files', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        q: `name='${sheetName}' and mimeType='application/vnd.google-apps.spreadsheet'`,
      },
    });

    if (response.data.files.length === 0) {
      const createResponse = await axios.post(
        'https://sheets.googleapis.com/v4/spreadsheets',
        {
          properties: { title: sheetName },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return createResponse.data.spreadsheetId;
    } else {
      return response.data.files[0].id;
    }
  },
});

export const getExpensesFromSheet = async (accessToken: string, spreadsheetId: string): Promise<Expense[]> => {
  const response = await axios.get(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const values = response.data.values || [];

  return values.map((row: string[]) => ({
    date: row[0],
    amount: parseFloat(row[1]),
    title: row[2],
    category: row[3],
    paymentMode: row[4] as 'Cash' | 'Digital',
    recurring: row[5] === 'TRUE',
    beneficiary: row[6] as 'Self' | 'Family' | 'Friends' | 'Vehicle',
    tags: (row[7] || "").split(','),
  }));
};

export const addExpenseToSheet = async (accessToken: string, spreadsheetId: string, expense: Expense): Promise<void> => {
  await axios.post(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1:append`,
    {
      range: 'Sheet1',
      values: [[
        expense.date,
        expense.amount,
        expense.title,
        expense.category,
        expense.paymentMode,
        expense.recurring ? 'TRUE' : 'FALSE',
        expense.beneficiary,
        expense.tags.join(',')
      ]],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      params: {
        valueInputOption: 'RAW',
      },
    }
  );
};

export const updateExpenseInSheet = async (accessToken: string, spreadsheetId: string, index: number, expense: Expense): Promise<void> => {
  await axios.put(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A${index + 1}`,
    {
      range: `Sheet1!A${index + 1}`,
      values: [[
        expense.date,
        expense.amount,
        expense.title,
        expense.category,
        expense.paymentMode,
        expense.recurring ? 'TRUE' : 'FALSE',
        expense.beneficiary,
        expense.tags.join(',')
      ]],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      params: {
        valueInputOption: 'RAW',
      },
    }
  );
};

export const deleteExpenseFromSheet = async (accessToken: string, spreadsheetId: string, index: number): Promise<void> => {
  await axios.post(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      requests: [
        {
          deleteRange: {
            range: {
              sheetId: 0, // Assuming Sheet1 is the first sheet
              startRowIndex: index,
              endRowIndex: index + 1,
            },
            shiftDimension: 'ROWS',
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
};
