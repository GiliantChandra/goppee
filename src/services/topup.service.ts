import api from './api';

export interface ValasAccount {
  id: string;
  userId: string;
  currency: string;
  balance: string;
  createdAt: string;
  updatedAt: string;
}

export interface ValasData {
  accounts: ValasAccount[];
  rates: Record<string, string>; // currency -> rateToIdr (as string)
}

export async function getValas(): Promise<ValasData> {
  const res = await api.get<ValasData>('/valas');
  return res.data;
}

export async function convertCurrency(input: {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  accountId?: string; // required when fromCurrency === 'IDR'
  idempotencyKey: string;
  pin: string;
}): Promise<{ message: string; foreignAmount: number; idrAmount: number; currency: string }> {
  const res = await api.post('/valas/convert', input);
  return res.data;
}

export async function initiateTopup(input: {
  accountId: string;
  amount: number;
  method: 'VIRTUAL_ACCOUNT' | 'BANK_TRANSFER' | 'CREDIT_CARD';
}): Promise<{ message: string; hint: string; expiresInMinutes: number }> {
  const res = await api.post('/topup/initiate', input);
  return res.data;
}

export async function verifyTopup(input: {
  accountId: string;
  otp: string;
  idempotencyKey: string;
}): Promise<{ message: string; transaction: Record<string, unknown> }> {
  const res = await api.post('/topup/verify', input);
  return res.data;
}
