import { api, ApiResponse } from './api';
import { AppNotification } from '@/types';

export async function fetchNotifications(page = 1, limit = 20) {
  const res = await api.get<ApiResponse<AppNotification[]>>('/notifications', { params: { page, limit } });
  return {
    items: res.data.data,
    total: res.data.meta?.total ?? res.data.data.length,
    unreadCount: (res.data.meta as any)?.unreadCount ?? 0,
  };
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await api.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
  return res.data.data.count;
}

export async function markNotificationRead(id: number): Promise<void> {
  await api.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch('/notifications/read-all');
}