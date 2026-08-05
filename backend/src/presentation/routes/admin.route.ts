import { Router } from 'express';
import { PrismaAdminStatsRepository } from '@infrastructure/repositories/PrismaAdminStatsRepository';
import { GetAdminStatsUseCase } from '@application/use-cases/AdminStatsUseCase';
import { authenticate } from '@presentation/middlewares/authenticate';
import { authorize } from '@presentation/middlewares/authorize';

const adminStatsRepository = new PrismaAdminStatsRepository();
const getStatsUseCase = new GetAdminStatsUseCase(adminStatsRepository);

export const adminRouter = Router();

adminRouter.get('/admin/stats', authenticate, authorize('ADMIN'), async (_req, res, next) => {
  try {
    const stats = await getStatsUseCase.execute();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
});
