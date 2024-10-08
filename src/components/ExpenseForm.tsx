// src/components/ExpenseForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Box,
  Container,
} from '@mui/material';
import {
  DateInput,
  AmountInput,
  TitleInput,
  CategoryInput,
  PaymentModeInput,
  RecurringInput,
  BeneficiaryInput,
  TagsInput,
} from './Inputs';
import { Beneficiary, Expense, PaymentMode } from '../types/Expense';
import { useTranslation } from 'react-i18next';

interface ExpenseFormProps {
  onSaveExpense: (expense: Expense) => void;
  initialData: Expense | null;
  isEditForm: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSaveExpense, initialData, isEditForm }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.Digital);
  const [recurring, setRecurring] = useState<boolean>(false);
  const [beneficiary, setBeneficiary] = useState<Beneficiary>(Beneficiary.Self);
  const [tags, setTags] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setAmount(initialData.amount.toString());
      setTitle(initialData.title);
      setCategory(initialData.category);
      setPaymentMode(initialData.paymentMode);
      setRecurring(initialData.recurring);
      setBeneficiary(initialData.beneficiary);
      setTags(initialData.tags.join(', '));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category || newCategory;
    onSaveExpense({ date, amount: +amount, title, category: finalCategory, paymentMode, recurring, beneficiary, tags: tags.split(',') });
  };

  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <DateInput value={date} onChange={setDate} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AmountInput value={amount} onChange={setAmount} />
          </Grid>
          <Grid item xs={12}>
            <TitleInput value={title} onChange={setTitle} />
          </Grid>
          <Grid item xs={12}>
            <CategoryInput selectedCategory={category} onChange={setCategory} newCategory={newCategory} onNewCategoryChange={setNewCategory} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PaymentModeInput selectedMode={paymentMode} onChange={setPaymentMode} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <BeneficiaryInput selectedBeneficiary={beneficiary} onChange={setBeneficiary} />
          </Grid>
          <Grid item xs={12}>
            <TagsInput value={tags} onChange={setTags} />
          </Grid>
          <Grid item xs={12}>
            <RecurringInput value={recurring} onChange={setRecurring} />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{
              margin: '0 0 20px 0',
            }}>
              { t(isEditForm ? 'button-label-update-expense' : 'button-label-add-expense') }
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ExpenseForm;
