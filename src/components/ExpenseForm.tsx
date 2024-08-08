// src/components/ExpenseForm.tsx
import React, { useState } from 'react';
import {
  Button,
  Grid,
  Box,
  Container,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  DateInput,
  AmountInput,
  TitleInput,
  CategoryInput,
  TagsInput,
} from './Inputs';
import { Expense } from '../types/Expense';

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
            <Typography component="legend">Payment Mode</Typography>
            <ToggleButtonGroup
              value={paymentMode}
              exclusive
              onChange={(e, value) => setPaymentMode(value)}
              fullWidth
            >
              <ToggleButton value="Cash">Cash</ToggleButton>
              <ToggleButton value="Digital">Digital</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography component="legend">Beneficiary</Typography>
            <ToggleButtonGroup
              value={beneficiary}
              exclusive
              onChange={(e, value) => setBeneficiary(value)}
              fullWidth
            >
              <ToggleButton value="Self">Self</ToggleButton>
              <ToggleButton value="Family">Family</ToggleButton>
              <ToggleButton value="Friends">Friends</ToggleButton>
              <ToggleButton value="Vehicle">Vehicle</ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12}>
            <TagsInput value={tags} onChange={setTags} />
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={recurring} onChange={() => setRecurring(!recurring)} />}
                label="Recurring"
              />
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Expense
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ExpenseForm;
