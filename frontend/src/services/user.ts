import { api, ApiResponse } from './api';
import { User } from '@/types';

export async function updateProfile(userId: number, input: { name?: string; avatarUrl?: string | null }) {
  const res = await api.patch<ApiResponse<User>>(`/users/${userId}`, input);
  return res.data.data;
}