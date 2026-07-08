import api from './api';

export interface LoginResponse {
  accessToken: string;
  expiresIn: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/auth/login', { email, password });
  localStorage.setItem('accessToken', res.data.accessToken);
  return res.data;
}

export async function register(email: string, password: string, name: string, phone?: string) {
  const res = await api.post('/auth/register', { email, password, name, phone });
  return res.data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout').catch(() => {}); // don't fail on network error
  localStorage.removeItem('accessToken');
}

export async function getMe(): Promise<User> {
  const res = await api.get<{ user: User }>('/auth/me');
  return res.data.user;
}

export async function verifyPin(pin: string): Promise<boolean> {
  const res = await api.post<{ valid: boolean }>('/auth/verify-pin', { pin });
  return res.data.valid;
}

export async function setPin(pin: string): Promise<void> {
  await api.put('/auth/set-pin', { pin });
}
