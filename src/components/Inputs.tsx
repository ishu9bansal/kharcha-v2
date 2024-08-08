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
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={6} sm={4} md={3} key={category}>
            <FormControlLabel
              control={<Radio />}
              label={category}
              value={category}
              checked={selectedCategory === category}
              onChange={() => onChange(category)}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <TextField
            label="Add New Category"
            type="text"
            value={newCategory}
            onChange={(e) => onNewCategoryChange(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>
    </FormControl>
  );
};

export const TagsInput: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => (
  <TextField
    label="Tags"
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
  />
);
