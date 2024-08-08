// src/components/Inputs.tsx
import React from 'react';
import { TextField, FormControl, FormControlLabel, RadioGroup, Radio, Checkbox, Grid, Typography } from '@mui/material';

export const DateInput: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => (
  <TextField
    label="Date"
    type="date"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    InputLabelProps={{
      shrink: true,
    }}
    required
  />
);

export const AmountInput: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => (
  <TextField
    label="Amount"
    type="number"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    required
  />
);

export const TitleInput: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => (
  <TextField
    label="Title"
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    required
  />
);

export const CategoryInput: React.FC<{
  selectedCategory: string;
  onChange: (value: string) => void;
  newCategory: string;
  onNewCategoryChange: (value: string) => void;
}> = ({ selectedCategory, onChange, newCategory, onNewCategoryChange }) => {
  const categories = [
    "Entertainment", "Food", "Groceries", "Gift", "Apparel", "Self Care", "Donation", "Capital Expense", "Travel", "Repair", "Medical", "Miscellaneous", "Petrol"
  ];

  return (
    <FormControl component="fieldset" fullWidth>
      <Typography component="legend">Category</Typography>
      <RadioGroup
        value={selectedCategory}
        onChange={(e) => onChange(e.target.value)}
      >
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            value={category}
            control={<Radio />}
            label={category}
          />
        ))}
        <TextField
          label="Add New Category"
          type="text"
          value={newCategory}
          onChange={(e) => onNewCategoryChange(e.target.value)}
          fullWidth
        />
      </RadioGroup>
    </FormControl>
  );
};

export const PaymentModeInput: React.FC<{
  selectedMode: 'Cash' | 'Digital';
  onChange: (value: 'Cash' | 'Digital') => void;
}> = ({ selectedMode, onChange }) => (
  <FormControl component="fieldset" fullWidth>
    <Typography component="legend">Payment Mode</Typography>
    <RadioGroup
      value={selectedMode}
      onChange={(e) => onChange(e.target.value as 'Cash' | 'Digital')}
    >
      <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
      <FormControlLabel value="Digital" control={<Radio />} label="Digital" />
    </RadioGroup>
  </FormControl>
);

export const RecurringInput: React.FC<{ value: boolean, onChange: (value: boolean) => void }> = ({ value, onChange }) => (
  <FormControlLabel
    control={
      <Checkbox
        checked={value}
        onChange={() => onChange(!value)}
      />
    }
    label="Recurring"
  />
);

export const BeneficiaryInput: React.FC<{
  selectedBeneficiary: 'Self' | 'Family' | 'Friends' | 'Vehicle';
  onChange: (value: 'Self' | 'Family' | 'Friends' | 'Vehicle') => void;
}> = ({ selectedBeneficiary, onChange }) => (
  <FormControl component="fieldset" fullWidth>
    <Typography component="legend">Beneficiary</Typography>
    <RadioGroup
      value={selectedBeneficiary}
      onChange={(e) => onChange(e.target.value as 'Self' | 'Family' | 'Friends' | 'Vehicle')}
    >
      <FormControlLabel value="Self" control={<Radio />} label="Self" />
      <FormControlLabel value="Family" control={<Radio />} label="Family" />
      <FormControlLabel value="Friends" control={<Radio />} label="Friends" />
      <FormControlLabel value="Vehicle" control={<Radio />} label="Vehicle" />
    </RadioGroup>
  </FormControl>
);

export const TagsInput: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => (
  <TextField
    label="Tags"
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
  />
);
