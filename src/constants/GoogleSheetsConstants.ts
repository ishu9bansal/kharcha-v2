import { AxiosHeaders } from 'axios';

export const sheetName = 'KharchaApp/ExpensesSheet';
export const sheetPageName = 'Sheet1';
export const mimeTypeSpreadSheet = 'application/vnd.google-apps.spreadsheet';

export const HeaderKeyContentType = 'Content-Type';
export const ContentTypeApplicationJson = 'application/json';

export const GoogleApiDriveUrl = 'https://www.googleapis.com/drive/v3/files';
export const GoogleApiSpreadsheetsUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

export const generateHeaders = (accessToken: string): AxiosHeaders => {
  let headers = new AxiosHeaders();
  headers.setAuthorization(`Bearer ${accessToken}`);
  headers.setContentType(ContentTypeApplicationJson);
  return headers;
};

export const generateParamsForRequest = () => ({
  valueInputOption: 'RAW',
});

export const searchFileByNameQuery = (filename: string, mimeType: string): string => {
  return `name='${filename}' and mimeType='${mimeType}'`;
};

export const appendSheetDataUri = (spreadsheetId: string, pageName: string): string => {
  return `${GoogleApiSpreadsheetsUrl}/${spreadsheetId}/values/${pageName}:append`;
};

export const getSheetDataUri = (spreadsheetId: string, pageName: string): string => {
  return `${GoogleApiSpreadsheetsUrl}/${spreadsheetId}/values/${pageName}`;
};

export const updateSheetRowUri = (spreadsheetId: string, pageName: string, index: number): string => {
  return `${GoogleApiSpreadsheetsUrl}/${spreadsheetId}/values/${pageName}!A${index}`
};

export const batchUpdateSheetUri = (spreadsheetId: string): string => {
  return `${GoogleApiSpreadsheetsUrl}/${spreadsheetId}:batchUpdate`;
};
