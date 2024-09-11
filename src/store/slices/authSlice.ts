import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IExpenseService } from '../../services/IExpenseService';
import { useDispatch, useSelector } from 'react-redux';
import { expenseServiceLocator } from '../../utils/expenseService';
import { useEffect } from 'react';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  service: IExpenseService | null;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  isAuthenticated: false,
  service: null,
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
    setExpenseService: (state: AuthState, action: PayloadAction<IExpenseService | null>) => {
        state.service = action.payload;
    },
    authError: (state: AuthState, action: PayloadAction<string | null>) => {
        state.isAuthenticated = false;
        state.error = action.payload;
    },
  },
});

export const { setAccessToken, setExpenseService, authError } = authSlice.actions;
export const selectAuth = (state: RootState) => state.auth;
export const useExpenseServiceLocator = () => {
    const { isAuthenticated, accessToken } = useSelector(selectAuth);
    const dispatch = useDispatch();
    useEffect(() => {
        expenseServiceLocator(isAuthenticated, accessToken)
        .then((expenseService) => dispatch(setExpenseService(expenseService)));
    }, [isAuthenticated, accessToken, setExpenseService]);
}
export default authSlice.reducer;
