import { Router } from 'express';
import { PrismaCategoryRepository } from '@infrastructure/repositories/PrismaCategoryRepository';
import {
  ListCategoriesUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from '@application/use-cases/CategoryUseCases';
import { validateBody } from '@presentation/middlewares/validateBody';
import { authenticate } from '@presentation/middlewares/authenticate';
import { authorize } from '@presentation/middlewares/authorize';
import { createCategorySchema, updateCategorySchema } from '@presentation/validators/category.validators';

const categoryRepository = new PrismaCategoryRepository();
const listUseCase = new ListCategoriesUseCase(categoryRepository);
const createUseCase = new CreateCategoryUseCase(categoryRepository);
const updateUseCase = new UpdateCategoryUseCase(categoryRepository);
const deleteUseCase = new DeleteCategoryUseCase(categoryRepository);

export const categoryRouter = Router();

categoryRouter.get('/categories', async (_req, res, next) => {
  try {
    const categories = await listUseCase.execute();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
});

categoryRouter.post(
  '/categories',
  authenticate,
  authorize('ADMIN'),
  validateBody(createCategorySchema),
  async (req, res, next) => {
    try {
      const category = await createUseCase.execute(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  }
);

categoryRouter.patch(
  '/categories/:id',
  authenticate,
  authorize('ADMIN'),
  validateBody(updateCategorySchema),
  async (req, res, next) => {
    try {
      const category = await updateUseCase.execute(Number(req.params.id), req.body);
      res.json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  }
);

categoryRouter.delete('/categories/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    await deleteUseCase.execute(Number(req.params.id));
    res.json({ success: true, data: { message: 'Catégorie supprimée' } });
  } catch (err) {
    next(err);
  }
});
