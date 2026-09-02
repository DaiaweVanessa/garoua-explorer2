import { Router } from 'express';
import { PrismaCommentRepository } from '@infrastructure/repositories/PrismaCommentRepository';
import { PrismaPlaceRepository } from '@infrastructure/repositories/PrismaPlaceRepository';
import {
  ListCommentsUseCase,
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  LikeCommentUseCase,
  UnlikeCommentUseCase,
} from '@application/use-cases/CommentUseCases';
import { validateBody } from '@presentation/middlewares/validateBody';
import { validateQuery } from '@presentation/middlewares/validateQuery';
import { authenticate, optionalAuthenticate } from '@presentation/middlewares/authenticate';
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
const likeUseCase = new LikeCommentUseCase(commentRepository);
const unlikeUseCase = new UnlikeCommentUseCase(commentRepository);

export const commentRouter = Router();

commentRouter.get(
  '/places/:id/comments',
  optionalAuthenticate,
  validateQuery(listCommentsQuerySchema),
  async (req, res, next) => {
    try {
      const q = (req as any).validatedQuery;
      const result = await listUseCase.execute(
        Number(req.params.id),
        q.page,
        q.limit,
        req.auth?.userId
      );
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
        req.body.content,
        req.body.parentId ?? null
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

commentRouter.post('/comments/:id/like', authenticate, async (req, res, next) => {
  try {
    const result = await likeUseCase.execute(req.auth!.userId, Number(req.params.id));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

commentRouter.delete('/comments/:id/like', authenticate, async (req, res, next) => {
  try {
    const result = await unlikeUseCase.execute(req.auth!.userId, Number(req.params.id));
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});