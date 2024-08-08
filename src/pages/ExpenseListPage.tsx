// src/pages/ExpenseListPage.tsx
import React from 'react';
import ExpenseList from '../components/ExpenseList';
import { Expense } from '../types/Expense';

const ExpenseListPage: React.FC = () => {
  // Dummy data for testing
  const expenses: Expense[] = [
    {
      date: '2024-08-01',
      amount: 50,
      title: 'Groceries',
      category: 'Food',
      paymentMode: 'Digital',
      recurring: false,
      beneficiary: 'Self',
      tags: ['Essentials'],
    },
    // More dummy data can be added
  ];

  return (
    <div>
      <ExpenseList expenses={expenses} onDeleteExpense={(index) => console.log('Delete expense at index:', index)} />
    </div>
  );
};

export default ExpenseListPage;
