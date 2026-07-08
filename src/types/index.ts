export type PageName = 'login' | 'dashboard' | 'transfer' | 'transactions' | 'cards' | 'settings' | 'loans' | 'investments' | 'pockets' | 'valas' | 'topup';


export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  joinDate: string;
}

export interface Account {
  id: string;
  type: 'checking' | 'savings' | 'investment';
  label: string;
  balance: number;
  currency: string;
  accountNumber: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  gradient: [string, string];
}

export type TransactionType = 'debit' | 'credit';
export type TransactionCategory =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'entertainment'
  | 'health'
  | 'transfer'
  | 'salary'
  | 'utilities'
  | 'travel';

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string;
  accountId: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Contact {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  avatar: string;
  color: string;
}

export interface SpendingData {
  month: string;
  amount: number;
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  target: number;
  current: number;
  deadline: string;
  color: string;
}

export interface Loan {
  id: string;
  name: string;
  totalAmount: number;
  remaining: number;
  monthlyPayment: number;
  nextDueDate: string;
  interestRate: number;
  color: string;
  icon: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
}
