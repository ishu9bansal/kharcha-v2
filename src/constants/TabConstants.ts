import { RelativeAddExpense, RelativeViewExpenses } from "./UrlConstants";

export enum HeaderTab {
    AddExpense,
    ViewExpenses,
}

export const TabPath: Record<HeaderTab, string> = {
    [HeaderTab.AddExpense]: RelativeAddExpense,
    [HeaderTab.ViewExpenses]: RelativeViewExpenses,
}

export const TabLabel: Record<HeaderTab, string> = {
    [HeaderTab.AddExpense]: "tab-label-add-expense",
    [HeaderTab.ViewExpenses]: "tab-label-view-expenses",
}

export const AllTabs: HeaderTab[] = [
    HeaderTab.AddExpense,
    HeaderTab.ViewExpenses,
];