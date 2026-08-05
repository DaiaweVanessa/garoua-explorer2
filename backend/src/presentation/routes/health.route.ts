import { Router } from 'express';
import { prisma } from '@infrastructure/prisma/client';

export const healthRouter = Router();

healthRouter.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, data: { status: 'ok', database: 'connected' } });
  } catch (err) {
    res.status(503).json({
      success: false,
      error: { code: 'DB_UNAVAILABLE', message: 'Base de données injoignable' },
    });
  }
});
