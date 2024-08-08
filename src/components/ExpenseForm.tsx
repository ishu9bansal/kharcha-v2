// src/components/ExpenseForm.tsx
import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { Expense } from '../types/Expense';
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

interface ExpenseFormProps {
  onSaveExpense: (expense: Expense) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSaveExpense }) => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Digital'>('Cash');
  const [recurring, setRecurring] = useState<boolean>(false);
  const [beneficiary, setBeneficiary] = useState<'Self' | 'Family' | 'Friends' | 'Vehicle'>('Self');
  const [tags, setTags] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category || newCategory;
    onSaveExpense({ date, amount: +amount, title, category: finalCategory, paymentMode, recurring, beneficiary, tags: tags.split(',') });
    setDate(new Date().toISOString().split('T')[0]);
    setAmount('');
    setTitle('');
    setCategory('');
    setNewCategory('');
    setPaymentMode('Cash');
    setRecurring(false);
    setBeneficiary('Self');
    setTags('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <DateInput value={date} onChange={setDate} />
        </Grid>
        <Grid item xs={12}>
          <AmountInput value={amount} onChange={setAmount} />
        </Grid>
        <Grid item xs={12}>
          <TitleInput value={title} onChange={setTitle} />
        </Grid>
        <Grid item xs={12}>
          <CategoryInput selectedCategory={category} onChange={setCategory} newCategory={newCategory} onNewCategoryChange={setNewCategory} />
        </Grid>
        <Grid item xs={12}>
          <PaymentModeInput selectedMode={paymentMode} onChange={setPaymentMode} />
        </Grid>
        <Grid item xs={12}>
          <RecurringInput value={recurring} onChange={setRecurring} />
        </Grid>
        <Grid item xs={12}>
          <BeneficiaryInput selectedBeneficiary={beneficiary} onChange={setBeneficiary} />
        </Grid>
        <Grid item xs={12}>
          <TagsInput value={tags} onChange={setTags} />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            Add Expense
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ExpenseForm;
