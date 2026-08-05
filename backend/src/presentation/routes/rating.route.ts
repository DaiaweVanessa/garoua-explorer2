import { Router } from 'express';
import { PrismaRatingRepository } from '@infrastructure/repositories/PrismaRatingRepository';
import { PrismaPlaceRepository } from '@infrastructure/repositories/PrismaPlaceRepository';
import { RatePlaceUseCase, GetRatingSummaryUseCase } from '@application/use-cases/RatingUseCases';
import { validateBody } from '@presentation/middlewares/validateBody';
import { authenticate } from '@presentation/middlewares/authenticate';
import { createRatingSchema } from '@presentation/validators/interaction.validators';

const ratingRepository = new PrismaRatingRepository();
const placeRepository = new PrismaPlaceRepository();

const rateUseCase = new RatePlaceUseCase(ratingRepository, placeRepository);
const summaryUseCase = new GetRatingSummaryUseCase(ratingRepository);

export const ratingRouter = Router();

ratingRouter.post(
  '/places/:id/ratings',
  authenticate,
  validateBody(createRatingSchema),
  async (req, res, next) => {
    try {
      const summary = await rateUseCase.execute(req.auth!.userId, Number(req.params.id), req.body.stars);
      res.status(201).json({ success: true, data: summary });
    } catch (err) {
      next(err);
    }
  }
);

ratingRouter.get('/places/:id/ratings/summary', async (req, res, next) => {
  try {
    const summary = await summaryUseCase.execute(Number(req.params.id));
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});
