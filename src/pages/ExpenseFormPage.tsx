// src/pages/ExpenseFormPage.tsx
import React, { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import { Expense, LocationState } from '../types/Expense';
import { useLocation, useNavigate } from 'react-router-dom';
import { HeaderTab, TabPath } from '../constants/TabConstants';
import { addExpense, updateExpense } from '../store/slices/expensesSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';

export const ExpenseFormPage: React.FC = () => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [initialExpenseData, setInitialExpenseData] = useState<Expense | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    const state = location.state as LocationState;
    if (state) {
      setInitialExpenseData(state.expense);
      setEditingIndex(state.index);
    }
  }, [location.state]);

  const handleSaveExpense = async (expense: Expense) => {
    if (editingIndex !== null) {
      dispatch(updateExpense({ index: editingIndex, expense }));
    } else {
      dispatch(addExpense(expense));
    }
    navigate(TabPath[HeaderTab.ViewExpenses]);
  };

  return (
    <div>
      <ExpenseForm onSaveExpense={handleSaveExpense} initialData={initialExpenseData} isEditForm={editingIndex !== null} />
    </div>
  );
};
