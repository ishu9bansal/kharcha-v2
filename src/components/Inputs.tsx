// src/components/Inputs.tsx
import React from 'react';
import {
  TextField,
  FormControl,
  FormControlLabel,
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  FormGroup,
} from '@mui/material';

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
          <Grid item xs={6} sm={3} key={category}>
            <ToggleButtonGroup
              value={selectedCategory}
              exclusive
              onChange={(e, value) => onChange(value)}
              fullWidth
            >
              <ToggleButton value={category} style={{ width: '100%' }}>
                {category}
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        ))}
      </Grid>
      <TextField
        label="Add New Category"
        type="text"
        value={newCategory}
        onChange={(e) => onNewCategoryChange(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
    </FormControl>
  );
};

export const PaymentModeInput: React.FC<{
  selectedMode: 'Cash' | 'Digital';
  onChange: (value: 'Cash' | 'Digital') => void;
}> = ({ selectedMode, onChange }) => (
  <FormControl component="fieldset" fullWidth>
    <Typography component="legend">Payment Mode</Typography>
    <ToggleButtonGroup
      value={selectedMode}
      exclusive
      onChange={(e, value) => onChange(value)}
      fullWidth
    >
      <ToggleButton value="Cash">Cash</ToggleButton>
      <ToggleButton value="Digital">Digital</ToggleButton>
    </ToggleButtonGroup>
  </FormControl>
);

export const RecurringInput: React.FC<{ value: boolean, onChange: (value: boolean) => void }> = ({ value, onChange }) => (
  <FormGroup>
    <FormControlLabel
      control={
        <Switch
          checked={value}
          onChange={() => onChange(!value)}
        />
      }
      label="Recurring"
    />
  </FormGroup>
);

export const BeneficiaryInput: React.FC<{
  selectedBeneficiary: 'Self' | 'Family' | 'Friends' | 'Vehicle';
  onChange: (value: 'Self' | 'Family' | 'Friends' | 'Vehicle') => void;
}> = ({ selectedBeneficiary, onChange }) => (
  <FormControl component="fieldset" fullWidth>
    <Typography component="legend">Beneficiary</Typography>
    <ToggleButtonGroup
      value={selectedBeneficiary}
      exclusive
      onChange={(e, value) => onChange(value)}
      fullWidth
    >
      <ToggleButton value="Self">Self</ToggleButton>
      <ToggleButton value="Family">Family</ToggleButton>
      <ToggleButton value="Friends">Friends</ToggleButton>
      <ToggleButton value="Vehicle">Vehicle</ToggleButton>
    </ToggleButtonGroup>
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
