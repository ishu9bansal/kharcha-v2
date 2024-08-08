// src/components/ExpenseList.tsx
import React from 'react';
import { Expense } from '../types/Expense';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (index: number) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Payment Mode</TableCell>
            <TableCell>Recurring</TableCell>
            <TableCell>Beneficiary</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses.map((expense, index) => (
            <TableRow key={index}>
              <TableCell>{expense.date}</TableCell>
              <TableCell>{expense.amount}</TableCell>
              <TableCell>{expense.title}</TableCell>
              <TableCell>{expense.category}</TableCell>
              <TableCell>{expense.paymentMode}</TableCell>
              <TableCell>{expense.recurring ? 'Yes' : 'No'}</TableCell>
              <TableCell>{expense.beneficiary}</TableCell>
              <TableCell>{expense.tags.join(', ')}</TableCell>
              <TableCell>
                <Button variant="contained" color="secondary" onClick={() => onDeleteExpense(index)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExpenseList;
