import { Router } from 'express';
import { PrismaUserRepository } from '@infrastructure/repositories/PrismaUserRepository';
import {
  ListUsersUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '@application/use-cases/UserManagementUseCases';
import { validateBody } from '@presentation/middlewares/validateBody';
import { validateQuery } from '@presentation/middlewares/validateQuery';
import { authenticate } from '@presentation/middlewares/authenticate';
import { authorize } from '@presentation/middlewares/authorize';
import { updateUserSchema, listUsersQuerySchema } from '@presentation/validators/user.validators';

const userRepository = new PrismaUserRepository();
const listUseCase = new ListUsersUseCase(userRepository);
const getUseCase = new GetUserUseCase(userRepository);
const updateUseCase = new UpdateUserUseCase(userRepository);
const deleteUseCase = new DeleteUserUseCase(userRepository);

export const userRouter = Router();

userRouter.get('/users', authenticate, authorize('ADMIN'), validateQuery(listUsersQuerySchema), async (req, res, next) => {
  try {
    const q = (req as any).validatedQuery;
    const result = await listUseCase.execute(q.page, q.limit);
    res.json({
      success: true,
      data: result.items,
      meta: { page: result.page, limit: result.limit, total: result.total },
    });
  } catch (err) {
    next(err);
  }
});

userRouter.get('/users/:id', authenticate, async (req, res, next) => {
  try {
    const user = await getUseCase.execute(Number(req.params.id));
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

userRouter.patch('/users/:id', authenticate, validateBody(updateUserSchema), async (req, res, next) => {
  try {
    const user = await updateUseCase.execute(Number(req.params.id), req.body, req.auth!);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

userRouter.delete('/users/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    await deleteUseCase.execute(Number(req.params.id));
    res.json({ success: true, data: { message: 'Utilisateur supprimé' } });
  } catch (err) {
    next(err);
  }
});
