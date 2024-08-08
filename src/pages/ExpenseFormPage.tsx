// src/pages/ExpenseFormPage.tsx
import React from 'react';
import ExpenseForm from '../components/ExpenseForm';

const ExpenseFormPage: React.FC = () => {
  return (
    <div>
      <ExpenseForm onSaveExpense={(expense) => console.log('Expense saved:', expense)} />
    </div>
  );
};

export default ExpenseFormPage;
