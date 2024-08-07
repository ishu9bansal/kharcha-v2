// src/components/DateInput.tsx
import React from 'react';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label>Date:</label>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)} required />
    </div>
  );
};

// src/components/AmountInput.tsx

interface AmountInputProps {
    value: string;
    onChange: (value: string) => void;
  }
  
export const AmountInput: React.FC<AmountInputProps> = ({ value, onChange }) => {
  return (
    <div>
    <label>Amount:</label>
    <input type="number" value={value} onChange={(e) => onChange(e.target.value)} required />
    </div>
  );
};

// src/components/TitleInput.tsx

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TitleInput: React.FC<TitleInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label>Title:</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} required />
    </div>
  );
};

// src/components/CategoryInput.tsx

interface CategoryInputProps {
  selectedCategory: string;
  onChange: (value: string) => void;
  newCategory: string;
  onNewCategoryChange: (value: string) => void;
}

const categories = [
  "Entertainment", "Food", "Groceries", "Gift", "Apparel", "Self Care", "Donation", "Capital Expense", "Travel", "Repair", "Medical", "Miscellaneous", "Petrol"
];

export const CategoryInput: React.FC<CategoryInputProps> = ({ selectedCategory, onChange, newCategory, onNewCategoryChange }) => {
  return (
    <div>
      <label>Category:</label>
      <div>
        {categories.map(category => (
          <label key={category}>
            <input type="radio" name="category" value={category} checked={selectedCategory === category} onChange={() => onChange(category)} />
            {category}
          </label>
        ))}
        <input type="text" value={newCategory} onChange={(e) => onNewCategoryChange(e.target.value)} placeholder="Add New Category" />
      </div>
    </div>
  );
};

// src/components/PaymentModeInput.tsx

interface PaymentModeInputProps {
  selectedMode: 'Cash' | 'Digital';
  onChange: (value: 'Cash' | 'Digital') => void;
}

export const PaymentModeInput: React.FC<PaymentModeInputProps> = ({ selectedMode, onChange }) => {
  return (
    <div>
      <label>Payment Mode:</label>
      <div>
        <label>
          <input type="radio" name="payment-mode" value="Cash" checked={selectedMode === 'Cash'} onChange={() => onChange('Cash')} />
          Cash
        </label>
        <label>
          <input type="radio" name="payment-mode" value="Digital" checked={selectedMode === 'Digital'} onChange={() => onChange('Digital')} />
          Digital
        </label>
      </div>
    </div>
  );
};

// src/components/RecurringInput.tsx

interface RecurringInputProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const RecurringInput: React.FC<RecurringInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label>Recurring:</label>
      <input type="checkbox" checked={value} onChange={() => onChange(!value)} />
    </div>
  );
};

// src/components/BeneficiaryInput.tsx

interface BeneficiaryInputProps {
  selectedBeneficiary: 'Self' | 'Family' | 'Friends' | 'Vehicle';
  onChange: (value: 'Self' | 'Family' | 'Friends' | 'Vehicle') => void;
}

export const BeneficiaryInput: React.FC<BeneficiaryInputProps> = ({ selectedBeneficiary, onChange }) => {
  return (
    <div>
      <label>Beneficiary:</label>
      <div>
        <label>
          <input type="radio" name="beneficiary" value="Self" checked={selectedBeneficiary === 'Self'} onChange={() => onChange('Self')} />
          Self
        </label>
        <label>
          <input type="radio" name="beneficiary" value="Family" checked={selectedBeneficiary === 'Family'} onChange={() => onChange('Family')} />
          Family
        </label>
        <label>
          <input type="radio" name="beneficiary" value="Friends" checked={selectedBeneficiary === 'Friends'} onChange={() => onChange('Friends')} />
          Friends
        </label>
        <label>
          <input type="radio" name="beneficiary" value="Vehicle" checked={selectedBeneficiary === 'Vehicle'} onChange={() => onChange('Vehicle')} />
          Vehicle
        </label>
      </div>
    </div>
  );
};

// src/components/TagsInput.tsx

interface TagsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TagsInput: React.FC<TagsInputProps> = ({ value, onChange }) => {
  return (
    <div>
      <label>Tags:</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};
