export enum PaymentMode {
  Cash = 'Cash',
  Digital = 'Digital',
};

export const PaymentModes = [
  PaymentMode.Cash,
  PaymentMode.Digital,
];

export enum Beneficiary {
  Self = 'Self',
  Family = 'Family',
  Friends = 'Friends',
  Vehicle = 'Vehicle',
};

export const Beneficiaries = [
  Beneficiary.Self,
  Beneficiary.Family,
  Beneficiary.Friends,
  Beneficiary.Vehicle,
];

export enum Category {
  Entertainment = 'Entertainment',
  Food = 'Food',
  Groceries = 'Groceries',
  Gift = 'Gift',
  Apparel = 'Apparel',
  SelfCare = 'Self Care',
  Donation = 'Donation',
  CapitalExpense = 'Capital Expense',
  Travel = 'Travel',
  Repair = 'Repair',
  Medical = 'Medical',
  Miscellaneous = 'Miscellaneous',
  Petrol = 'Petrol',
}

export const Categories = [
  Category.Entertainment,
  Category.Food,
  Category.Groceries,
  Category.Gift,
  Category.Apparel,
  Category.SelfCare,
  Category.Donation,
  Category.CapitalExpense,
  Category.Travel,
  Category.Repair,
  Category.Medical,
  Category.Miscellaneous,
  Category.Petrol,
]

export interface Expense {
  date: string;
  amount: number;
  title: string;
  category: string;
  paymentMode: PaymentMode;
  recurring: boolean;
  beneficiary: Beneficiary;
  tags: string[];
};

export type LocationState = { expense: Expense, index: number | null };
