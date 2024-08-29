// src/types/Expense.ts
export interface Expense {
  date: string;
  amount: number;
  title: string;
  category: string;
  paymentMode: 'Cash' | 'Digital';
  recurring: boolean;
  beneficiary: 'Self' | 'Family' | 'Friends' | 'Vehicle';
  tags: string[];
};

export type LocationState = { expense: Expense, index: number | null };
