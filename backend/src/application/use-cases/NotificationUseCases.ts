import { NotificationRepository } from '@domain/repositories/NotificationRepository';

export class ListNotificationsUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}
  execute(userId: number, page: number, limit: number) {
    return this.notificationRepository.listByUser(userId, page, limit);
  }
}

export class MarkNotificationReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}
  execute(id: number, userId: number) {
    return this.notificationRepository.markAsRead(id, userId);
  }
}

export class MarkAllNotificationsReadUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}
  execute(userId: number) {
    return this.notificationRepository.markAllAsRead(userId);
  }
}

export class CountUnreadNotificationsUseCase {
  constructor(private readonly notificationRepository: NotificationRepository) {}
  execute(userId: number) {
    return this.notificationRepository.countUnread(userId);
  }
}