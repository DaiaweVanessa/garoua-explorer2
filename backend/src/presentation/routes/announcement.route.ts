import { Router } from 'express';
import { PrismaNotificationRepository } from '@infrastructure/repositories/PrismaNotificationRepository';
import { PrismaUserRepository } from '@infrastructure/repositories/PrismaUserRepository';
import { authenticate } from '@presentation/middlewares/authenticate';
import { authorize } from '@presentation/middlewares/authorize';
import { validateBody } from '@presentation/middlewares/validateBody';
import { z } from 'zod';

const notificationRepository = new PrismaNotificationRepository();
const userRepository = new PrismaUserRepository();

const announcementSchema = z.object({
  message: z.string().min(3, 'Le message doit contenir au moins 3 caracteres').max(500),
  link: z.string().optional(),
});

export const announcementRouter = Router();

announcementRouter.post(
  '/admin/announcements',
  authenticate,
  authorize('ADMIN'),
  validateBody(announcementSchema),
  async (req, res, next) => {
    try {
      // Recupere tous les utilisateurs par pages pour eviter de tout charger en memoire d'un coup
      let page = 1;
      const limit = 200;
      let totalNotified = 0;

      while (true) {
        const { items, total } = await userRepository.findMany(page, limit);
        if (items.length === 0) break;

        await notificationRepository.createMany(
          items.map((u) => ({
            userId: u.id,
            type: 'ANNOUNCEMENT' as const,
            message: req.body.message,
            link: req.body.link ?? null,
          }))
        );

        totalNotified += items.length;
        if (page * limit >= total) break;
        page++;
      }

      res.status(201).json({ success: true, data: { notified: totalNotified } });
    } catch (err) {
      next(err);
    }
  }
);