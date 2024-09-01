// src/utils/googleSheetsHelper.ts
import axios, { AxiosHeaders } from 'axios';
import { Beneficiary, Expense, PaymentMode } from '../types/Expense';
import { ExpenseField } from '../types/ExpenseField';

const HeaderKeyContentType = 'Content-Type';
const ContentTypeApplicationJson = 'application/json';

const sheetName = 'KharchaApp/ExpensesSheet';
const sheetPageName = 'Sheet1';
const mimeTypeSpreadSheet = 'application/vnd.google-apps.spreadsheet';

const GoogleApiDriveUrl = 'https://www.googleapis.com/drive/v3/files';
const GoogleApiSpreadsheetsUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

const generateHeaders = (accessToken: string): AxiosHeaders => {
  let headers = new AxiosHeaders();
  headers.setAuthorization(`Bearer ${accessToken}`);
  headers.setContentType(ContentTypeApplicationJson);
  return headers;
};

const generateParamsForRequest = () => ({
  valueInputOption: 'RAW',
});

const searchFileByNameQuery = (filename: string, mimeType: string): string => {
  return `name='${filename}' and mimeType='${mimeType}'`;
};

const appendSheetDataUri = (spreadsheetId: string, pageName: string): string => {
  return `${GoogleApiSpreadsheetsUrl}/${spreadsheetId}/values/${pageName}:append`;
};

const getSheetDataUri = (spreadsheetId: string, pageName: string): string => {
  return `${GoogleApiSpreadsheetsUrl}/${spreadsheetId}/values/${pageName}`;
};

const updateSheetRowUri = (spreadsheetId: string, pageName: string, index: number): string => {
  return `${GoogleApiSpreadsheetsUrl}/${spreadsheetId}/values/${pageName}!A${index}`
};

const batchUpdateSheetUri = (spreadsheetId: string): string => {
  return `${GoogleApiSpreadsheetsUrl}/${spreadsheetId}:batchUpdate`;
};


const createNewSpreadsheet = async (sheetName: string, accessToken: string): Promise<string> => {
  const headers = generateHeaders(accessToken);
  const body = { properties: { title: sheetName } };
  const response = await axios.post(GoogleApiSpreadsheetsUrl, body, { headers } );
  return response.data.spreadsheetId;
};


const appendRowsToSpreadsheet = async (spreadsheetId: string, values: string[][], accessToken: string): Promise<void> => {
  const headers = generateHeaders(accessToken);
  const params = generateParamsForRequest()
  const body = { range: sheetPageName, values };
  await axios.post(
    appendSheetDataUri(spreadsheetId, sheetPageName),
    body,
    {
      headers,
      params,
    }
  );
};

const updateRowInSpreadsheet = async (spreadsheetId: string, index: number, row: string[], accessToken: string): Promise<void> => {
  const headers = generateHeaders(accessToken);
  const params = generateParamsForRequest()
  const body = { range: `${sheetPageName}!A${index}`, values: [row] };
  await axios.put(
    updateSheetRowUri(spreadsheetId, sheetPageName, index),
    body,
    {
      headers,
      params,
    }
  );
};

const deleteRowsFromSpreadsheet = async (spreadsheetId: string, sheetPageIndex: number, startRowIndex: number, numberOfRows: number, accessToken: string): Promise<void> => {
  const headers = generateHeaders(accessToken);
  const requests = [
    {
      deleteRange: {
        range: {
          sheetId: sheetPageIndex,
          startRowIndex,
          endRowIndex: startRowIndex + numberOfRows,
        },
        shiftDimension: 'ROWS',
      },
    },
  ];
  await axios.post(batchUpdateSheetUri(spreadsheetId), { requests }, { headers } );
};

export const searchSheetsByName = async (sheetName: string, accessToken: string): Promise<any[]> => {
  let headers = generateHeaders(accessToken);
  headers.delete(HeaderKeyContentType); // not needed in a get request
  const params = { q: searchFileByNameQuery(sheetName, mimeTypeSpreadSheet) };
  const response = await axios.get(GoogleApiDriveUrl, { headers, params } );
  return response.data.files;
};

export const getDataFromSheet = async (spreadsheetId: string, pageName: string, accessToken: string): Promise<string[][]> => {
  let headers = generateHeaders(accessToken);
  headers.delete(HeaderKeyContentType); // not needed in a get request
  const response = await axios.get(getSheetDataUri(spreadsheetId, pageName), { headers } );
  return response.data.values || [];
};

export const deserialize = (row: string[]): Expense => ({
  date: row[0],
  amount: parseFloat(row[1]),
  title: row[2],
  category: row[3],
  paymentMode: row[4] as PaymentMode,
  recurring: row[5] === 'TRUE',
  beneficiary: row[6] as Beneficiary,
  tags: (row[7] || "").split(','),
});

export const serialize = (expense: Expense): string[] => ([
  expense.date,
  expense.amount.toString(),
  expense.title,
  expense.category,
  expense.paymentMode,
  expense.recurring ? 'TRUE' : 'FALSE',
  expense.beneficiary,
  expense.tags.join(',')
]);

export const getGoogleSheetsClient = (accessToken: string) => ({
  getOrCreateSheet: async (): Promise<string> => {
    // search sheet in user's files
    const files = await searchSheetsByName(sheetName, accessToken);

    if (files.length > 1) {
      throw "More than one files with the same name";
    }

    if (files.length === 1) {
      return files[0].id; // return the id of the found file
    }

    // In case we did not find a file, create a new file and return its id

    const spreadsheetId = await createNewSpreadsheet(sheetName, accessToken);
    const initRow: string[] = [
      ExpenseField.Date,
      ExpenseField.Amount,
      ExpenseField.Title,
      ExpenseField.Category,
      ExpenseField.PaymentMode,
      ExpenseField.Recurring,
      ExpenseField.Beneficiary,
      ExpenseField.Tags
    ];  // Column names of the expected records
    await appendRowsToSpreadsheet(spreadsheetId, [initRow], accessToken);
    return spreadsheetId;
  },
});

export const getExpensesFromSheet = async (accessToken: string, spreadsheetId: string): Promise<Expense[]> => {
  const values = await getDataFromSheet(spreadsheetId, sheetPageName, accessToken);
  return values.splice(1).map(deserialize); // First row is the column names
};

export const addExpenseToSheet = async (accessToken: string, spreadsheetId: string, expense: Expense): Promise<void> => {
  const row = serialize(expense);
  await appendRowsToSpreadsheet(spreadsheetId, [row], accessToken);
};

export const updateExpenseInSheet = async (accessToken: string, spreadsheetId: string, index: number, expense: Expense): Promise<void> => {
  const row = serialize(expense)
  await updateRowInSpreadsheet(spreadsheetId, index+2, row, accessToken);
  // +1 for index is 0 based while sheets are 1 based 
  // +1 for first row being the column names
};

export const deleteExpenseFromSheet = async (accessToken: string, spreadsheetId: string, index: number): Promise<void> => {
  await deleteRowsFromSpreadsheet(spreadsheetId, 0, index+1, 1, accessToken);
  // Assuming Sheet1 is the first sheet hence pageIndex 0
  // index+1 for column names
};

/**
 * TODO:
 * - There are multiple calls to the search api
 * - access token and spreadsheet id could be stored in memory to be used for back to back actions
 * 
 */