import api from './api';

export interface Account {
  id: string;
  type: 'CHECKING' | 'SAVINGS' | 'INVESTMENT';
  label: string;
  balance: string; // BigInt serialized as string
  accountNumber: string;
  cardNumberMasked: string;
  expiryDate: string;
  gradient: string[];
  isFrozen: boolean;
  isActive: boolean;
  dailyTransferLimit: string;
  onlinePurchaseLimit: string;
  atmWithdrawalLimit: string;
}

export async function getAccounts(): Promise<Account[]> {
  const res = await api.get<Account[]>('/accounts');
  return res.data;
}

export async function getAccount(id: string): Promise<Account> {
  const res = await api.get<Account>(`/accounts/${id}`);
  return res.data;
}

export async function freezeAccount(id: string): Promise<{ id: string; isFrozen: boolean }> {
  const res = await api.patch(`/accounts/${id}/freeze`);
  return res.data;
}

export async function getTotals(): Promise<{ totalBalance: string; accountCount: number }> {
  const res = await api.get('/accounts/summary/totals');
  return res.data;
}

/** Format BigInt string to Indonesian Rupiah */
export function formatIDR(amountStr: string): string {
  const num = parseInt(amountStr, 10);
  return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`;
}
