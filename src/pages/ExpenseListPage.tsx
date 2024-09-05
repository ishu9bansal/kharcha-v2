// src/pages/ExpenseListPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import ExpenseList from '../components/ExpenseList';
import { IExpenseService } from '../services/IExpenseService';
import { LocalStorageService } from '../services/LocalStorageService';
import { useNavigate } from 'react-router-dom';
import { Expense, LocationState } from '../types/Expense';
import { HeaderTab, TabPath } from '../constants/TabConstants';

interface ExpenseListPageProps {
  expenseService: IExpenseService;
}

export const ExpenseListPage: React.FC<ExpenseListPageProps> = ({ expenseService }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      const data = await expenseService.getExpenses();
      setExpenses(data);
    };

    fetchExpenses();
  }, [expenseService]);

  const handleEditExpense = useCallback((index: number) => {
    const state: LocationState = { expense: expenses[index], index };
    navigate(TabPath[HeaderTab.AddExpense], { state });
  }, [navigate, expenses]);

  const handleDeleteExpense = useCallback(async (index: number) => {
    await expenseService.deleteExpense(index);
    setExpenses(await expenseService.getExpenses());
  }, [expenseService]);

  return (
    <div>
      <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} onEditExpense={handleEditExpense} />
    </div>
  );
};

// Use Singleton instance of LocalStorageService by default
export const LocalExpenseListPage = () => <ExpenseListPage expenseService={LocalStorageService.getInstance()} />;
