import { ExpenseField } from "../types/ExpenseField";
import { appendSheetDataUri, batchUpdateSheetUri, generateHeaders, generateParamsForRequest, getSheetDataUri, GoogleApiDriveUrl, GoogleApiSpreadsheetsUrl, HeaderKeyContentType, mimeTypeSpreadSheet, searchFileByNameQuery, sheetName, sheetPageName, updateSheetRowUri } from "../constants/GoogleSheetsConstants";
import axios from "axios";
import { Beneficiary, Expense, PaymentMode } from "../types/Expense";

export class GoogleSheetsClient {
    private static TRUE = 'TRUE';
    private static FALSE = 'FALSE';

    private accessToken: string;
    private spreadsheetId: string;
    private sheetPageName: string;
    private sheetPageIndex: number;

    public constructor() {
        this.accessToken = "";
        this.spreadsheetId = "";
        this.sheetPageName = "";
        this.sheetPageIndex = 0;
    }

    public async initSetupWithAccessToken(accessToken: string): Promise<void> {
        // set default page
        this.setPage(sheetPageName, 0);

        // set auth token
        this.setAccessToken(accessToken);

        // set spreadsheet ID
        this.spreadsheetId = await this.getOrCreateSpreadsheet(sheetName);
    }

    private setAccessToken(accessToken: string) {
        this.accessToken = accessToken;
    }

    private async getOrCreateSpreadsheet(sheetName: string): Promise<string> {
        // search sheet in user's files
        const files = await this.searchSheetsByName(sheetName);

        if (files.length > 1) {
            throw "More than one files with the same name";
        }

        if (files.length === 1) {
            return files[0].id; // return the id of the found file
        }

        // In case we did not find a file, create a new file and return its id
        const spreadsheetId = await this.createNewSpreadsheet(sheetName);
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
        await this.appendRowsToSpreadsheet([initRow], spreadsheetId);
        return spreadsheetId;
    }

    private setPage(sheetPageName: string, sheetPageIndex: number): void {
        this.sheetPageIndex = sheetPageIndex;
        this.sheetPageName = sheetPageName;
    }

    private async searchSheetsByName(sheetName: string): Promise<any[]> {
        let headers = generateHeaders(this.accessToken);
        headers.delete(HeaderKeyContentType); // not needed in a get request
        const params = { q: searchFileByNameQuery(sheetName, mimeTypeSpreadSheet) };
        const response = await axios.get(GoogleApiDriveUrl, { headers, params });
        return response.data.files;
    };

    private async createNewSpreadsheet(sheetName: string): Promise<string> {
        const headers = generateHeaders(this.accessToken);
        const body = { properties: { title: sheetName } };
        const response = await axios.post(GoogleApiSpreadsheetsUrl, body, { headers });
        return response.data.spreadsheetId;
    };

    public async getDataFromSheet(): Promise<string[][]> {
        let headers = generateHeaders(this.accessToken);
        headers.delete(HeaderKeyContentType); // not needed in a get request
        const response = await axios.get(getSheetDataUri(this.spreadsheetId, this.sheetPageName), { headers });
        return response.data.values || [];
    };

    public async appendRowsToSpreadsheet(values: string[][], spreadsheetId: string = this.spreadsheetId): Promise<void> {
        const headers = generateHeaders(this.accessToken);
        const params = generateParamsForRequest()
        const body = { range: this.sheetPageName, values };
        await axios.post(
            appendSheetDataUri(spreadsheetId, this.sheetPageName),
            body,
            {
                headers,
                params,
            },
        );
    };

    public async updateRowInSpreadsheet(index: number, row: string[]): Promise<void> {
        const headers = generateHeaders(this.accessToken);
        const params = generateParamsForRequest()
        const body = { range: `${sheetPageName}!A${index}`, values: [row] };
        await axios.put(
            updateSheetRowUri(this.spreadsheetId, this.sheetPageName, index),
            body,
            {
                headers,
                params,
            },
        );
    };

    public async deleteRowsFromSpreadsheet(startRowIndex: number, numberOfRows: number): Promise<void> {
        const headers = generateHeaders(this.accessToken);
        const requests = [
            {
                deleteRange: {
                    range: {
                        sheetId: this.sheetPageIndex,
                        startRowIndex,
                        endRowIndex: startRowIndex + numberOfRows,
                    },
                    shiftDimension: 'ROWS',
                },
            },
        ];
        await axios.post(batchUpdateSheetUri(this.spreadsheetId), { requests }, { headers });
    };

    public deserialize(row: string[]): Expense {
        return {
            date: row[0],
            amount: parseFloat(row[1]),
            title: row[2],
            category: row[3],
            paymentMode: row[4] as PaymentMode,
            recurring: row[5] === GoogleSheetsClient.TRUE,
            beneficiary: row[6] as Beneficiary,
            tags: (row[7] || "").split(','),
        }
    };

    public serialize(expense: Expense): string[] {
        return [
            expense.date,
            expense.amount.toString(),
            expense.title,
            expense.category,
            expense.paymentMode,
            expense.recurring ? GoogleSheetsClient.TRUE : GoogleSheetsClient.FALSE,
            expense.beneficiary,
            expense.tags.join(',')
        ]
    };
};