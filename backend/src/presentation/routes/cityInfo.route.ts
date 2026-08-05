import { Router } from 'express';
import { PrismaCityInfoRepository } from '@infrastructure/repositories/PrismaCityInfoRepository';
import { GetCityInfoUseCase, UpdateCityInfoUseCase } from '@application/use-cases/GarouaContentUseCases';
import { validateBody } from '@presentation/middlewares/validateBody';
import { authenticate } from '@presentation/middlewares/authenticate';
import { authorize } from '@presentation/middlewares/authorize';
import { upsertCityInfoSchema } from '@presentation/validators/garouaContent.validators';

const cityInfoRepository = new PrismaCityInfoRepository();
const getUseCase = new GetCityInfoUseCase(cityInfoRepository);
const updateUseCase = new UpdateCityInfoUseCase(cityInfoRepository);

export const cityInfoRouter = Router();

cityInfoRouter.get('/city-info', async (_req, res, next) => {
  try {
    const info = await getUseCase.execute();
    res.json({ success: true, data: info });
  } catch (err) {
    next(err);
  }
});

cityInfoRouter.put(
  '/city-info',
  authenticate,
  authorize('ADMIN'),
  validateBody(upsertCityInfoSchema),
  async (req, res, next) => {
    try {
      const info = await updateUseCase.execute(req.body);
      res.json({ success: true, data: info });
    } catch (err) {
      next(err);
    }
  }
);
