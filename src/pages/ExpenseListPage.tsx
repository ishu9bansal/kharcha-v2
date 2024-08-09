// src/pages/ExpenseListPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import ExpenseList from '../components/ExpenseList';
import { IExpenseService } from '../services/IExpenseService';
import { LocalStorageService } from '../services/LocalStorageService';
import { useNavigate } from 'react-router-dom';
import { Expense } from '../types/Expense';

interface ExpenseListPageProps {
  expenseService: IExpenseService;
}

const ExpenseListPage: React.FC<ExpenseListPageProps> = ({ expenseService }) => {
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
    navigate('/', { state: { expense: expenses[index], index } });
  }, [navigate, expenses]);

  const handleDeleteExpense = useCallback(async (index: number) => {
    await expenseService.deleteExpense(index);
    setExpenses(await expenseService.getExpenses());
  }, [expenses, expenseService]);

  return (
    <div>
      <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} onEditExpense={handleEditExpense} />
    </div>
  );
};

// Use Singleton instance of LocalStorageService by default
const DefaultExpenseListPage = () => <ExpenseListPage expenseService={LocalStorageService.getInstance()} />;
export default DefaultExpenseListPage;
