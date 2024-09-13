import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { ExpenseServiceEnum } from '../../services/IExpenseService';
import { useDispatch, useSelector } from 'react-redux';
import { expenseServiceEnumLocator, getServiceFromEnum } from '../../utils/expenseService';
import { useEffect } from 'react';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  serviceEnum: ExpenseServiceEnum | null;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  serviceEnum: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state: AuthState, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },
    setExpenseServiceEnum: (state: AuthState, action: PayloadAction<ExpenseServiceEnum | null>) => {
        state.serviceEnum = action.payload;
    },
    authError: (state: AuthState, action: PayloadAction<string | null>) => {
        state.isAuthenticated = false;
        state.error = action.payload;
    },
  },
});

export const { setAccessToken, setExpenseServiceEnum, authError } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export const useExpenseService = () => {
    const { isAuthenticated, accessToken, serviceEnum } = useSelector(selectAuth);
    const dispatch = useDispatch();
    useEffect(() => {
        expenseServiceEnumLocator(isAuthenticated, accessToken)
        .then((expenseServiceEnum) => dispatch(setExpenseServiceEnum(expenseServiceEnum)));
    }, [isAuthenticated, accessToken, setExpenseServiceEnum]);
    return { expenseService: getServiceFromEnum(serviceEnum), isAuthenticated };
}
export default authSlice.reducer;
