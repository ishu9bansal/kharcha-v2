// src/pages/ExpenseListPage.tsx
import React, { useCallback } from 'react';
import ExpenseList from '../components/ExpenseList';
import { useNavigate } from 'react-router-dom';
import { LocationState } from '../types/Expense';
import { HeaderTab, TabPath } from '../constants/TabConstants';
import { deleteExpense, selectExpenses } from '../store/slices/expensesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store/store';

export const ExpenseListPage: React.FC = () => {
  const expenses = useSelector(selectExpenses);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

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
