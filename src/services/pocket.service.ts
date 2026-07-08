import api from './api';

export interface Pocket {
  id: string;
  userId: string;
  accountId: string;
  name: string;
  emoji: string;
  color: string;
  balance: string;
  goalAmount: string | null;
  goalDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getPockets(): Promise<Pocket[]> {
  const res = await api.get<Pocket[]>('/pockets');
  return res.data;
}

export async function createPocket(input: {
  accountId: string;
  name: string;
  emoji?: string;
  color?: string;
  goalAmount?: number;
  goalDate?: string;
}): Promise<Pocket> {
  const res = await api.post<Pocket>('/pockets', input);
  return res.data;
}

export async function updatePocket(id: string, input: {
  name?: string;
  emoji?: string;
  color?: string;
  goalAmount?: number | null;
  goalDate?: string | null;
}): Promise<Pocket> {
  const res = await api.patch<Pocket>(`/pockets/${id}`, input);
  return res.data;
}

export async function deletePocket(id: string): Promise<void> {
  await api.delete(`/pockets/${id}`);
}
