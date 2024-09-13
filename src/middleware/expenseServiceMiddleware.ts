import { Middleware } from '@reduxjs/toolkit';
import { setNotification } from '../store/slices/uiSlice';
import { ExpenseActionTypes, revertAddExpense, revertDeleteExpense, revertUpdateExpense, setExpensesList } from '../store/slices/expensesSlice';
import { IExpenseService } from '../services/IExpenseService';
import { Expense } from '../types/Expense';
import { AppDispatch, RootState } from '../store/store';
import { debounce } from '@mui/material';
import { getServiceFromEnum } from '../utils/expenseService';

// TODO: improve the stability by adding a middleware
// which just syncs the whole expense list in one go, along with some debounce logic

const addExpense = async (dispatch: AppDispatch, service: IExpenseService, expense: Expense): Promise<void> => {
    try {
        // Trigger API call to add expense
        await service.addExpense(expense);
    } catch (error) {
        // Dispatch failure action and notification
        dispatch(revertAddExpense());
        dispatch(setNotification('Failed to add expense'));
    } finally {
        fetchExpenses(dispatch, service);
    }
};

const updateExpense = async (dispatch: AppDispatch, service: IExpenseService, index: number, updatedExpense: Expense, currentExpense: Expense): Promise<void> => {

    try {
        // Trigger API call to update expense
        await service.updateExpense(index, updatedExpense);
    } catch (error) {
        // Dispatch failure action and notification
        dispatch(revertUpdateExpense({ index, expense: currentExpense }));
        dispatch(setNotification('Failed to update expense'));
    } finally {
        fetchExpenses(dispatch, service);
    }
};

const deleteExpense = async (dispatch: AppDispatch, service: IExpenseService, index: number, currentExpense: Expense): Promise<void> => {
    try {
        // Trigger API call to delete expense
        await service.deleteExpense(index);
    } catch (error) {
        // Dispatch failure action and notification
        dispatch(revertDeleteExpense({ index, expense: currentExpense }));
        dispatch(setNotification('Failed to delete expense'));
    } finally {
        fetchExpenses(dispatch, service);
    }
};

const fetchExpenses = debounce(async (dispatch: AppDispatch, service: IExpenseService): Promise<void> => {
    try {
        // Trigger API call to get expenses
        const expenses = await service.getExpenses();
        // Dispatch action to set expenses
        dispatch(setExpensesList(expenses));
    } catch (error) {
        // Dispatch failure action and notification
        dispatch(setNotification('Failed to fetch expenses'));
    }
}, 1000);

const expenseServiceMiddleware: Middleware = ({ dispatch, getState }) => next => async (action) => {
    const state = getState() as RootState;
    const serviceEnum = state.auth.serviceEnum; // Get current expense service
    const service = getServiceFromEnum(serviceEnum);
    if(!service) {
        // TODO: bug fix, somehow leading to long call stack
        // dispatch(setNotification('Service not ready'));
        return next(action);
    }

    // actually the type of action will not only be this in runtime
    // but all other case will go in default case so this is safe
    const localAction = action as ExpenseActionTypes;
    switch (localAction.type) {
        case 'expenses/addExpense': {
            const expense = localAction.payload;
            addExpense(dispatch, service, expense);
            break;
        }

        case 'expenses/updateExpense': {
            const { index, expense: updatedExpense } = localAction.payload;
            const currentExpense = getState().expenses.list[index];
            updateExpense(dispatch, service, index, updatedExpense, currentExpense);
            break;
        }

        case 'expenses/deleteExpense': {
            const index = localAction.payload;
            const currentExpense = getState().expenses.list[index];
            deleteExpense(dispatch, service, index, currentExpense);
            break;
        }

        case 'expenses/fetchExpenses': {
            fetchExpenses(dispatch, service);
            break;
        }

        default:    break;
    }

    return next(localAction); // Always pass the action to the next middleware or reducer
};

export default expenseServiceMiddleware;
