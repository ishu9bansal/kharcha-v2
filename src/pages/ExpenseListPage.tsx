// src/pages/ExpenseListPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import ExpenseList from '../components/ExpenseList';
import { getExpensesFromLocalStorage, saveExpensesToLocalStorage } from '../utils/localStorageHelpers';
import { useNavigate } from 'react-router-dom';
import { Expense } from '../types/Expense';

const ExpenseListPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setExpenses(getExpensesFromLocalStorage());
  }, []);

  const handleDeleteExpense = useCallback((index: number) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
    saveExpensesToLocalStorage(updatedExpenses);
    setExpenses(updatedExpenses);
  }, [expenses, setExpenses]);

  const handleEditExpense = useCallback((index: number) => {
    navigate('/', { state: { expense: expenses[index], index } });
  }, [navigate, expenses]);

  return (
    <div>
      <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} onEditExpense={handleEditExpense} />
    </div>
  );
};

export default ExpenseListPage;
