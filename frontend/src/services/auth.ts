import { api, ApiResponse } from './api';
import { User } from '@/types';

export interface AuthResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

function storeTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
}

export async function register(input: { name: string; email: string; password: string }) {
  const res = await api.post<ApiResponse<AuthResult>>('/auth/register', input);
  storeTokens(res.data.data.accessToken, res.data.data.refreshToken);
  return res.data.data.user;
}

export async function login(input: { email: string; password: string }) {
  const res = await api.post<ApiResponse<AuthResult>>('/auth/login', input);
  storeTokens(res.data.data.accessToken, res.data.data.refreshToken);
  return res.data.data.user;
}

export async function fetchMe() {
  const res = await api.get<ApiResponse<User>>('/auth/me');
  return res.data.data;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}