// src/App.tsx
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import { Expense } from './types/Expense';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <h1>Daily Expense Tracker</h1>
        <ExpenseForm onSaveExpense={handleSaveExpense} />
        <h2>Expense List</h2>
        <ExpenseList expenses={expenses} onDeleteExpense={handleDeleteExpense} />
      </div>
    </ThemeProvider>
  );
};

export default App;
