import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { Beneficiaries, Beneficiary, Categories, PaymentMode, PaymentModes } from '../types/Expense';
import { useTranslation } from 'react-i18next';
import { ExpenseField } from '../types/ExpenseField';

export const DateInput: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => {
  const { t } = useTranslation();
  return <TextField
    label={t(ExpenseField.Date)}
    type="date"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    InputLabelProps={{
      shrink: true,
    }}
    required
  />
};

export const AmountInput: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => {
  const { t } = useTranslation();
  return <TextField
    label={t(ExpenseField.Amount)}
    type="number"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    required
  />
};

export const TitleInput: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => {
  const { t } = useTranslation();
  return <TextField
    label={t(ExpenseField.Title)}
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
    required
  />
};

export const CategoryInput: React.FC<{
  selectedCategory: string;
  onChange: (value: string) => void;
  newCategory: string;
  onNewCategoryChange: (value: string) => void;
}> = ({ selectedCategory, onChange, newCategory, onNewCategoryChange }) => {
  const { t } = useTranslation();

  let categories: string[] = [];
  categories = categories.concat(Categories);
  categories = categories.concat(['Extra']);

  return (
    <FormControl component="fieldset" fullWidth>
      <Box border={1} borderColor="grey.500" borderRadius={2} p={2} mt={1}>
        <FormLabel component="legend">{t(ExpenseField.Category)}</FormLabel>
        <Grid container spacing={2} mt={1}>
          {categories.map((category: string) => (
            <Grid item xs={6} sm={3} key={category}>
              <ToggleButtonGroup
                value={selectedCategory}
                exclusive
                onChange={(e, value) => onChange(value)}
                fullWidth
              >
                <ToggleButton value={category} style={{ width: '100%' }}>
                  {t(category)}
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
          ))}
        </Grid>
        <TextField
          label={t('add-new-category-label')}
          type="text"
          value={newCategory}
          onChange={(e) => onNewCategoryChange(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
      </Box>
    </FormControl>
  );
};

export const PaymentModeInput: React.FC<{
  selectedMode: PaymentMode;
  onChange: (value: PaymentMode) => void;
}> = ({ selectedMode, onChange }) => {
  const { t } = useTranslation();
  return <FormControl component="fieldset" fullWidth>
    <Box border={1} borderColor="grey.500" borderRadius={2} p={2} mt={1}>
      <FormLabel component="legend">{t(ExpenseField.PaymentMode)}</FormLabel>
      <ToggleButtonGroup
        value={selectedMode}
        exclusive
        onChange={(e, value) => value && onChange(value)}
        fullWidth
      >
        {PaymentModes.map((paymentMode: PaymentMode) => (
          <ToggleButton value={paymentMode} key={paymentMode}>{t(paymentMode)}</ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  </FormControl>
};

export const RecurringInput: React.FC<{ value: boolean, onChange: (value: boolean) => void }> = ({ value, onChange }) => {
  const { t } = useTranslation();
  return <FormGroup>
    <Box border={1} borderColor="grey.500" borderRadius={2} p={2} mt={1}>
      <FormControlLabel
        control={
          <Switch
            checked={value}
            onChange={() => onChange(!value)}
          />
        }
        label={t(ExpenseField.Recurring)}
      />
    </Box>
  </FormGroup>
};

export const BeneficiaryInput: React.FC<{
  selectedBeneficiary: Beneficiary;
  onChange: (value: Beneficiary) => void;
}> = ({ selectedBeneficiary, onChange }) => {

  const { t } = useTranslation();

  return <FormControl component="fieldset" fullWidth>
    <Box border={1} borderColor="grey.500" borderRadius={2} p={2} mt={1}>
      <FormLabel component="legend">{t(ExpenseField.Beneficiary)}</FormLabel>
      <ToggleButtonGroup
        value={selectedBeneficiary}
        exclusive
        onChange={(e, value) => value && onChange(value)}
        fullWidth
      >
        {Beneficiaries.map((beneficiary: Beneficiary) => (
          <ToggleButton value={beneficiary} key={beneficiary}>{t(beneficiary)}</ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  </FormControl>
};

export const TagsInput: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => {
  const { t } = useTranslation();
  return <TextField
    label={t(ExpenseField.Tags)}
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    fullWidth
  />
};
