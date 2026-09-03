import { prisma } from '@infrastructure/prisma/client';
import {
  CreateNotificationInput,
  NotificationRepository,
  PaginatedNotifications,
} from '@domain/repositories/NotificationRepository';
import { Notification } from '@domain/entities/Notification';

export class PrismaNotificationRepository implements NotificationRepository {
  async listByUser(userId: number, page: number, limit: number): Promise<PaginatedNotifications> {
    const skip = (page - 1) * limit;
    const [items, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, read: false } }),
    ]);
    return { items: items as Notification[], total, unreadCount, page, limit };
  }

  async create(input: CreateNotificationInput): Promise<Notification> {
    const created = await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        message: input.message,
        link: input.link ?? null,
      },
    });
    return created as Notification;
  }

  async createMany(inputs: CreateNotificationInput[]): Promise<void> {
    if (inputs.length === 0) return;
    await prisma.notification.createMany({
      data: inputs.map((i) => ({
        userId: i.userId,
        type: i.type,
        message: i.message,
        link: i.link ?? null,
      })),
    });
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    await prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  async countUnread(userId: number): Promise<number> {
    return prisma.notification.count({ where: { userId, read: false } });
  }
}