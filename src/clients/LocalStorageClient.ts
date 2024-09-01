import { Expense } from "../types/Expense";

export class LocalStorageClient {
    private static ExpenseKey = 'expenses';

    public constructor(private storage: Storage) {}

    public getExpensesFromLocalStorage(): Expense[] {
        const expenses = this.storage.getItem(LocalStorageClient.ExpenseKey);
        return expenses ? JSON.parse(expenses) : [];
    };
      
    public saveExpensesToLocalStorage(expenses: Expense[]) {
        this.storage.setItem(LocalStorageClient.ExpenseKey, JSON.stringify(expenses));
    };
};