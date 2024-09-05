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
  Container,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ExpenseField } from '../types/ExpenseField';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (index: number) => void;
  onEditExpense: (index: number) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDeleteExpense, onEditExpense }) => {
  const { t } = useTranslation();
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t(ExpenseField.Date)}</TableCell>
              <TableCell>{t(ExpenseField.Amount)}</TableCell>
              <TableCell>{t(ExpenseField.Title)}</TableCell>
              <TableCell>{t(ExpenseField.Category)}</TableCell>
              <TableCell>{t(ExpenseField.PaymentMode)}</TableCell>
              <TableCell>{t(ExpenseField.Recurring)}</TableCell>
              <TableCell>{t(ExpenseField.Beneficiary)}</TableCell>
              <TableCell>{t(ExpenseField.Tags)}</TableCell>
              <TableCell>{t("view-expenses-column-name-actions")}</TableCell>
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
                <TableCell>{t(expense.recurring ? 'recurring-value-yes' : 'recurring-value-no')}</TableCell>
                <TableCell>{expense.beneficiary}</TableCell>
                <TableCell>{expense.tags.join(', ')}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => onEditExpense(index)}>
                    {t("view-expense-row-action-edit")}
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => onDeleteExpense(index)} sx={{ ml: 2 }}>
                  {t("view-expense-row-action-delete")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ExpenseList;
