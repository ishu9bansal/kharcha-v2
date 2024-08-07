// src/App.tsx
import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import './App.css';
import { Expense } from './types/Expense';

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const handleSaveExpense = (expense: Expense) => {
    setExpenses([...expenses, expense]);
  };

  const handleDeleteExpense = (index: number) => {
    const updatedExpenses = [...expenses];
    updatedExpenses.splice(index, 1);
    setExpenses(updatedExpenses);
  };

  return (
    <div className="App">
      <h1>Daily Expense Tracker</h1>
      <ExpenseForm onSaveExpense={handleSaveExpense} />
      <h2>Expense List</h2>
      <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
    </div>
  );
};

export default App;
