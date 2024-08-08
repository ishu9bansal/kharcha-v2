// src/pages/ExpenseFormPage.tsx
import React, { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import { addExpenseToLocalStorage, updateExpenseInLocalStorage, getExpensesFromLocalStorage } from '../utils/localStorageHelpers';
import { Expense } from '../types/Expense';
import { useLocation, useNavigate } from 'react-router-dom';

const ExpenseFormPage: React.FC = () => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [initialExpenseData, setInitialExpenseData] = useState<Expense | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load expense data if editing
  React.useEffect(() => {
    const state = location.state as { expense: Expense, index: number } | undefined;
    if (state) {
      setInitialExpenseData(state.expense);
      setEditingIndex(state.index);
    }
  }, [location.state]);

  const handleSaveExpense = (expense: Expense) => {
    if (editingIndex !== null) {
      updateExpenseInLocalStorage(editingIndex, expense);
      setEditingIndex(null);
    } else {
      addExpenseToLocalStorage(expense);
    }
    navigate('/expenses');
  };

  return (
    <div>
      <ExpenseForm onSaveExpense={handleSaveExpense} initialData={initialExpenseData} />
    </div>
  );
};

export default ExpenseFormPage;
