// src/pages/ExpenseFormPage.tsx
import React, { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm';
import { IExpenseService } from '../services/IExpenseService';
import { LocalStorageService } from '../services/LocalStorageService';
import { Expense } from '../types/Expense';
import { useLocation, useNavigate } from 'react-router-dom';

interface ExpenseFormPageProps {
  expenseService: IExpenseService;
}

const ExpenseFormPage: React.FC<ExpenseFormPageProps> = ({ expenseService }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [initialExpenseData, setInitialExpenseData] = useState<Expense | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const state = location.state as { expense: Expense, index: number } | undefined;
    if (state) {
      setInitialExpenseData(state.expense);
      setEditingIndex(state.index);
    }
  }, [location.state]);

  const handleSaveExpense = async (expense: Expense) => {
    if (editingIndex !== null) {
      await expenseService.updateExpense(editingIndex, expense);
      setEditingIndex(null);
    } else {
      await expenseService.addExpense(expense);
    }
    navigate('/expenses');
  };

  return (
    <div>
      <ExpenseForm onSaveExpense={handleSaveExpense} initialData={initialExpenseData} />
    </div>
  );
};

// Use Singleton instance of LocalStorageService by default
const DefaultExpenseFormPage = () => <ExpenseFormPage expenseService={LocalStorageService.getInstance()} />;
export default DefaultExpenseFormPage;
