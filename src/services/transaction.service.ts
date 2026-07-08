import api from './api';

export interface Transaction {
  id: string;
  userId: string;
  fromAccountId: string | null;
  toAccountId: string | null;
  amount: string;
  type: 'DEBIT' | 'CREDIT' | 'TRANSFER' | 'TOPUP' | 'VALAS_CONVERT' | 'POCKET_TRANSFER';
  category: string;
  title: string;
  subtitle: string | null;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
  idempotencyKey: string;
  note: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface TransactionFilters {
  category?: string;
  type?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getTransactions(filters?: TransactionFilters): Promise<{ transactions: Transaction[]; total: number }> {
  const res = await api.get('/transactions', { params: filters });
  return res.data;
}

export async function createTransfer(input: {
  fromAccountId: string;
  toAccountNumber: string;
  amount: number;
  note?: string;
  idempotencyKey: string;
  pin: string;
}) {
  const res = await api.post<Transaction>('/transactions/transfer', input);
  return res.data;
}

export async function pocketDeposit(input: {
  fromAccountId: string;
  toPocketId: string;
  amount: number;
  idempotencyKey: string;
}) {
  const res = await api.post<Transaction>('/transactions/pocket-deposit', input);
  return res.data;
}

export async function pocketWithdraw(input: {
  pocketId: string;
  toAccountId: string;
  amount: number;
  idempotencyKey: string;
}) {
  const res = await api.post<Transaction>('/transactions/pocket-withdraw', input);
  return res.data;
}
