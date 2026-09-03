import { Router } from 'express';
import { PrismaNotificationRepository } from '@infrastructure/repositories/PrismaNotificationRepository';
import {
  ListNotificationsUseCase,
  MarkNotificationReadUseCase,
  MarkAllNotificationsReadUseCase,
  CountUnreadNotificationsUseCase,
} from '@application/use-cases/NotificationUseCases';
import { authenticate } from '@presentation/middlewares/authenticate';
import { validateQuery } from '@presentation/middlewares/validateQuery';
import { z } from 'zod';

const notificationRepository = new PrismaNotificationRepository();
const listUseCase = new ListNotificationsUseCase(notificationRepository);
const markReadUseCase = new MarkNotificationReadUseCase(notificationRepository);
const markAllReadUseCase = new MarkAllNotificationsReadUseCase(notificationRepository);
const countUnreadUseCase = new CountUnreadNotificationsUseCase(notificationRepository);

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const notificationRouter = Router();

notificationRouter.get(
  '/notifications',
  authenticate,
  validateQuery(listQuerySchema),
  async (req, res, next) => {
    try {
      const q = (req as any).validatedQuery;
      const result = await listUseCase.execute(req.auth!.userId, q.page, q.limit);
      res.json({
        success: true,
        data: result.items,
        meta: { page: result.page, limit: result.limit, total: result.total, unreadCount: result.unreadCount },
      });
    } catch (err) {
      next(err);
    }
  }
);

notificationRouter.get('/notifications/unread-count', authenticate, async (req, res, next) => {
  try {
    const count = await countUnreadUseCase.execute(req.auth!.userId);
    res.json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
});

notificationRouter.patch('/notifications/:id/read', authenticate, async (req, res, next) => {
  try {
    await markReadUseCase.execute(Number(req.params.id), req.auth!.userId);
    res.json({ success: true, data: { message: 'Notification marquee comme lue' } });
  } catch (err) {
    next(err);
  }
});

notificationRouter.patch('/notifications/read-all', authenticate, async (req, res, next) => {
  try {
    await markAllReadUseCase.execute(req.auth!.userId);
    res.json({ success: true, data: { message: 'Toutes les notifications marquees comme lues' } });
  } catch (err) {
    next(err);
  }
});