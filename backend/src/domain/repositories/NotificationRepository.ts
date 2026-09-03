import { Notification, NotificationType } from '@domain/entities/Notification';

export interface CreateNotificationInput {
  userId: number;
  type: NotificationType;
  message: string;
  link?: string | null;
}

export interface PaginatedNotifications {
  items: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}

export interface NotificationRepository {
  listByUser(userId: number, page: number, limit: number): Promise<PaginatedNotifications>;
  create(input: CreateNotificationInput): Promise<Notification>;
  createMany(inputs: CreateNotificationInput[]): Promise<void>;
  markAsRead(id: number, userId: number): Promise<void>;
  markAllAsRead(userId: number): Promise<void>;
  countUnread(userId: number): Promise<number>;
}