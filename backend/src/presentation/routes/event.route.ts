import { Router } from 'express';
import { PrismaEventRepository } from '@infrastructure/repositories/PrismaEventRepository';
import {
  ListEventsUseCase,
  GetEventUseCase,
  CreateEventUseCase,
  UpdateEventUseCase,
  DeleteEventUseCase,
} from '@application/use-cases/EventUseCases';
import { validateBody } from '@presentation/middlewares/validateBody';
import { validateQuery } from '@presentation/middlewares/validateQuery';
import { authenticate } from '@presentation/middlewares/authenticate';
import { authorize } from '@presentation/middlewares/authorize';
import { createEventSchema, updateEventSchema, listEventsQuerySchema } from '@presentation/validators/event.validators';

const eventRepository = new PrismaEventRepository();
const listUseCase = new ListEventsUseCase(eventRepository);
const getUseCase = new GetEventUseCase(eventRepository);
const createUseCase = new CreateEventUseCase(eventRepository);
const updateUseCase = new UpdateEventUseCase(eventRepository);
const deleteUseCase = new DeleteEventUseCase(eventRepository);

export const eventRouter = Router();

eventRouter.get('/events', validateQuery(listEventsQuerySchema), async (req, res, next) => {
  try {
    const q = (req as any).validatedQuery;
    const events = await listUseCase.execute(Boolean(q.upcoming));
    res.json({ success: true, data: events });
  } catch (err) {
    next(err);
  }
});

eventRouter.get('/events/:id', async (req, res, next) => {
  try {
    const event = await getUseCase.execute(Number(req.params.id));
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
});

eventRouter.post(
  '/events',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  validateBody(createEventSchema),
  async (req, res, next) => {
    try {
      const event = await createUseCase.execute({ ...req.body, createdById: req.auth!.userId });
      res.status(201).json({ success: true, data: event });
    } catch (err) {
      next(err);
    }
  }
);

eventRouter.patch(
  '/events/:id',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  validateBody(updateEventSchema),
  async (req, res, next) => {
    try {
      const event = await updateUseCase.execute(Number(req.params.id), req.body);
      res.json({ success: true, data: event });
    } catch (err) {
      next(err);
    }
  }
);

eventRouter.delete('/events/:id', authenticate, authorize('ADMIN', 'MODERATOR'), async (req, res, next) => {
  try {
    await deleteUseCase.execute(Number(req.params.id));
    res.json({ success: true, data: { message: 'Événement supprimé' } });
  } catch (err) {
    next(err);
  }
});
