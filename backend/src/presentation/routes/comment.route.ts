import { Router } from 'express';
import { PrismaCommentRepository } from '@infrastructure/repositories/PrismaCommentRepository';
import { PrismaPlaceRepository } from '@infrastructure/repositories/PrismaPlaceRepository';
import {
  ListCommentsUseCase,
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
} from '@application/use-cases/CommentUseCases';
import { validateBody } from '@presentation/middlewares/validateBody';
import { validateQuery } from '@presentation/middlewares/validateQuery';
import { authenticate } from '@presentation/middlewares/authenticate';
import {
  createCommentSchema,
  updateCommentSchema,
  listCommentsQuerySchema,
} from '@presentation/validators/interaction.validators';

const commentRepository = new PrismaCommentRepository();
const placeRepository = new PrismaPlaceRepository();

const listUseCase = new ListCommentsUseCase(commentRepository);
const createUseCase = new CreateCommentUseCase(commentRepository, placeRepository);
const updateUseCase = new UpdateCommentUseCase(commentRepository);
const deleteUseCase = new DeleteCommentUseCase(commentRepository);

export const commentRouter = Router();

commentRouter.get(
  '/places/:id/comments',
  validateQuery(listCommentsQuerySchema),
  async (req, res, next) => {
    try {
      const q = (req as any).validatedQuery;
      const result = await listUseCase.execute(Number(req.params.id), q.page, q.limit);
      res.json({
        success: true,
        data: result.items,
        meta: { page: result.page, limit: result.limit, total: result.total },
      });
    } catch (err) {
      next(err);
    }
  }
);

commentRouter.post(
  '/places/:id/comments',
  authenticate,
  validateBody(createCommentSchema),
  async (req, res, next) => {
    try {
      const comment = await createUseCase.execute(
        req.auth!.userId,
        Number(req.params.id),
        req.body.content
      );
      res.status(201).json({ success: true, data: comment });
    } catch (err) {
      next(err);
    }
  }
);

commentRouter.patch(
  '/comments/:id',
  authenticate,
  validateBody(updateCommentSchema),
  async (req, res, next) => {
    try {
      const comment = await updateUseCase.execute(Number(req.params.id), req.body.content, req.auth!);
      res.json({ success: true, data: comment });
    } catch (err) {
      next(err);
    }
  }
);

commentRouter.delete('/comments/:id', authenticate, async (req, res, next) => {
  try {
    await deleteUseCase.execute(Number(req.params.id), req.auth!);
    res.json({ success: true, data: { message: 'Commentaire supprimé' } });
  } catch (err) {
    next(err);
  }
});
