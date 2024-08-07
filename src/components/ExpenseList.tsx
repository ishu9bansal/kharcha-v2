// src/components/ExpenseList.tsx
import React from 'react';
import { Expense } from '../types/Expense';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (index: number) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense }) => {
  return (
    <ul>
      {expenses.map((expense, index) => (
        <li key={index}>
          {expense.date} - ${expense.amount} - {expense.title} - {expense.category} - {expense.paymentMode} - {expense.recurring ? 'Recurring' : 'One-time'} - {expense.beneficiary} - Tags: {expense.tags.join(', ')}
          <button onClick={() => onDeleteExpense(index)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default ExpenseList;
