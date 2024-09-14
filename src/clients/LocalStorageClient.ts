import { Expense } from "../types/Expense";
import { IExpenseTypeConverter } from "./IExpenseTypeConverter";

export class LocalStorageClient implements IExpenseTypeConverter<Expense> {
    private static ExpenseKey = 'expenses';

    public constructor(private storage: Storage) {}

    public getExpensesFromLocalStorage(): Expense[] {
        const expenses = this.storage.getItem(LocalStorageClient.ExpenseKey);
        return expenses ? JSON.parse(expenses) : [];
    };
      
    public saveExpensesToLocalStorage(expenses: Expense[]) {
        this.storage.setItem(LocalStorageClient.ExpenseKey, JSON.stringify(expenses));
    };

    public serialize(expense: Expense): Expense {
        return expense;
    }

    public deserialize(value: Expense): Expense {
        return value;
    }
};