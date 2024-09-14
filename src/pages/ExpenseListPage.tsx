// src/pages/ExpenseListPage.tsx
import React, { useCallback, useEffect } from 'react';
import ExpenseList from '../components/ExpenseList';
import { useNavigate } from 'react-router-dom';
import { LocationState } from '../types/Expense';
import { HeaderTab, TabPath } from '../constants/TabConstants';
import { deleteExpense, fetchExpenses, selectExpenses } from '../store/slices/expensesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store/store';
import { useExpenseService } from '../store/slices/authSlice';

export const ExpenseListPage: React.FC = () => {
  const expenses = useSelector(selectExpenses);
  const { expenseService } = useExpenseService();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [expenseService]);

  const handleEditExpense = useCallback((index: number) => {
    const state: LocationState = { expense: expenses[index], index };
    navigate(TabPath[HeaderTab.AddExpense], { state });
  }, [navigate, expenses]);

  const handleDeleteExpense = useCallback(async (index: number) => {
    dispatch(deleteExpense(index));
  }, [dispatch]);

  return (
    <div>
      <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} onEditExpense={handleEditExpense} />
    </div>
  );
};
