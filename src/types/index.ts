export interface Category {
  id: string;
  name: string;
  budget: number;
  order: number;
}

export interface Expense {
  id: string;
  amount: number;
  categoryId?: string;
  note?: string;
  date: string;
  month: string; // '2026-02' format
}

export interface AppState {
  isOnboarded: boolean;
  monthlyIncome: number;
  monthlyInvestment: number;
  spendableAmount: number; // Calculated as Income - Investment
  useCategories: boolean;
  categories: Category[];
  expenses: Expense[];
  currentMonth: string;
  currency: string; // default '₹'
}

export const INITIAL_STATE: AppState = {
  isOnboarded: false,
  monthlyIncome: 0,
  monthlyInvestment: 0,
  spendableAmount: 0,
  useCategories: false,
  categories: [],
  expenses: [],
  currentMonth: new Date().toISOString().slice(0, 7),
  currency: '₹'
};