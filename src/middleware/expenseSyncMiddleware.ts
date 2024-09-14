import { Middleware } from '@reduxjs/toolkit';
import { setNotification } from '../store/slices/uiSlice';
import { ExpenseActionTypes, setExpensesList } from '../store/slices/expensesSlice';
import { IExpenseService } from '../services/IExpenseService';
import { AppDispatch, RootState } from '../store/store';
import { debounce } from '@mui/material';
import { getServiceFromEnum } from '../utils/expenseService';
import { AuthActionTypes } from '../store/slices/authSlice';

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

const syncExpenses = debounce(async (dispatch: AppDispatch, getState: () => RootState, service: IExpenseService): Promise<void> => {
    try {
        // Get all expenses from the current state (assuming we must have reached a stable value now)
        const expenses = getState().expenses.list;

        // Sync expenses in the service (delete existing records and replace them with all new)
        await service.setExpenses(expenses);
    } catch (error) {
        // Dispatch failure action and notification
        dispatch(setNotification('Failed to sync expenses'));
    } finally {
        fetchExpenses(dispatch, service);
    }
}, 2000);

type AllActions = ExpenseActionTypes | AuthActionTypes;

const middlewareOperation = async (dispatch: AppDispatch, getState: () => RootState, action: AllActions): Promise<void> => {
    const state = getState() as RootState;
    const serviceEnum = state.auth.serviceEnum; // Get current expense service
    const service = getServiceFromEnum(serviceEnum);
    if(!service) {
        return;
    }

    switch (action.type) {
        case 'expenses/addExpense':
        case 'expenses/updateExpense':
        case 'expenses/deleteExpense': {
            syncExpenses(dispatch, getState, service);
            break;
        }
        case 'expenses/fetchExpenses':
        case 'auth/setAccessToken':
        case 'auth/setExpenseServiceEnum':
        case 'auth/authError': {
            fetchExpenses(dispatch, service);
            break;
        }
        default:    break;
    }
};

const expenseSyncMiddleware: Middleware = ({ dispatch, getState }) => next => async (action) => {
    const nextResult = await next(action); // this middleware wants to action out of the chain, hence fetch results already
    setTimeout(() => middlewareOperation(dispatch, getState, action as AllActions), 1000);
    return nextResult;
};

export default expenseSyncMiddleware;
