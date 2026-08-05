import { Router } from 'express';
import { PrismaTransportRepository } from '@infrastructure/repositories/PrismaTransportRepository';
import {
  ListTransportUseCase,
  CreateTransportUseCase,
  UpdateTransportUseCase,
  DeleteTransportUseCase,
} from '@application/use-cases/TransportUseCases';
import { validateBody } from '@presentation/middlewares/validateBody';
import { authenticate } from '@presentation/middlewares/authenticate';
import { authorize } from '@presentation/middlewares/authorize';
import { createTransportSchema, updateTransportSchema } from '@presentation/validators/transport.validators';

const transportRepository = new PrismaTransportRepository();
const listUseCase = new ListTransportUseCase(transportRepository);
const createUseCase = new CreateTransportUseCase(transportRepository);
const updateUseCase = new UpdateTransportUseCase(transportRepository);
const deleteUseCase = new DeleteTransportUseCase(transportRepository);

export const transportRouter = Router();

transportRouter.get('/transport', async (_req, res, next) => {
  try {
    const options = await listUseCase.execute();
    res.json({ success: true, data: options });
  } catch (err) {
    next(err);
  }
});

transportRouter.post(
  '/transport',
  authenticate,
  authorize('ADMIN'),
  validateBody(createTransportSchema),
  async (req, res, next) => {
    try {
      const option = await createUseCase.execute(req.body);
      res.status(201).json({ success: true, data: option });
    } catch (err) {
      next(err);
    }
  }
);

// Route principale demandée dans le plan initial : l'admin ajuste les prix
transportRouter.patch(
  '/transport/:id',
  authenticate,
  authorize('ADMIN'),
  validateBody(updateTransportSchema),
  async (req, res, next) => {
    try {
      const option = await updateUseCase.execute(Number(req.params.id), req.body);
      res.json({ success: true, data: option });
    } catch (err) {
      next(err);
    }
  }
);

transportRouter.delete('/transport/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    await deleteUseCase.execute(Number(req.params.id));
    res.json({ success: true, data: { message: 'Option de transport supprimée' } });
  } catch (err) {
    next(err);
  }
});
