// src/pages/ExpenseFormPage.tsx
import React, { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import { IExpenseService } from '../services/IExpenseService';
import { LocalStorageService } from '../services/LocalStorageService';
import { Expense, LocationState } from '../types/Expense';
import { useLocation, useNavigate } from 'react-router-dom';
import { HeaderTab, TabPath } from '../constants/TabConstants';

interface ExpenseFormPageProps {
  expenseService: IExpenseService;
}

export const ExpenseFormPage: React.FC<ExpenseFormPageProps> = ({ expenseService }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [initialExpenseData, setInitialExpenseData] = useState<Expense | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const state = location.state as LocationState;
    if (state) {
      setInitialExpenseData(state.expense);
      setEditingIndex(state.index);
    }
  }, [location.state]);

  const handleSaveExpense = async (expense: Expense) => {
    if (editingIndex !== null) {
      await expenseService.updateExpense(editingIndex, expense);
    } else {
      await expenseService.addExpense(expense);
    }
    navigate(TabPath[HeaderTab.ViewExpenses]);
  };

  return (
    <div>
      <ExpenseForm onSaveExpense={handleSaveExpense} initialData={initialExpenseData} isEditForm={editingIndex !== null} />
    </div>
  );
};

// Use Singleton instance of LocalStorageService by default
export const LocalExpenseFormPage = () => <ExpenseFormPage expenseService={LocalStorageService.getInstance()} />;
