// src/components/ExpenseForm.tsx
import React, { useState } from 'react';
import { Expense } from '../types/Expense';
import { DateInput, AmountInput, TitleInput, CategoryInput, PaymentModeInput, RecurringInput, BeneficiaryInput, TagsInput } from './Inputs';

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
      <DateInput value={date} onChange={setDate} />
      <AmountInput value={amount} onChange={setAmount} />
      <TitleInput value={title} onChange={setTitle} />
      <CategoryInput selectedCategory={category} onChange={setCategory} newCategory={newCategory} onNewCategoryChange={setNewCategory} />
      <PaymentModeInput selectedMode={paymentMode} onChange={setPaymentMode} />
      <RecurringInput value={recurring} onChange={setRecurring} />
      <BeneficiaryInput selectedBeneficiary={beneficiary} onChange={setBeneficiary} />
      <TagsInput value={tags} onChange={setTags} />
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
