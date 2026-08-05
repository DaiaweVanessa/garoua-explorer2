import { Router } from 'express';
import { PrismaPlaceRepository } from '@infrastructure/repositories/PrismaPlaceRepository';
import { PrismaCategoryRepository } from '@infrastructure/repositories/PrismaCategoryRepository';
import {
  ListPlacesUseCase,
  GetPlaceUseCase,
  CreatePlaceUseCase,
  UpdatePlaceUseCase,
  DeletePlaceUseCase,
  AddPlacePhotoUseCase,
  DeletePlacePhotoUseCase,
} from '@application/use-cases/PlaceUseCases';
import { GetExcursionInfoUseCase, UpsertExcursionInfoUseCase } from '@application/use-cases/GarouaContentUseCases';
import { PrismaExcursionInfoRepository } from '@infrastructure/repositories/PrismaExcursionInfoRepository';
import { validateBody } from '@presentation/middlewares/validateBody';
import { validateQuery } from '@presentation/middlewares/validateQuery';
import { authenticate } from '@presentation/middlewares/authenticate';
import { authorize } from '@presentation/middlewares/authorize';
import {
  createPlaceSchema,
  updatePlaceSchema,
  listPlacesQuerySchema,
  addPhotoSchema,
} from '@presentation/validators/place.validators';
import { upsertExcursionInfoSchema } from '@presentation/validators/garouaContent.validators';

const placeRepository = new PrismaPlaceRepository();
const categoryRepository = new PrismaCategoryRepository();
const excursionInfoRepository = new PrismaExcursionInfoRepository();

const listUseCase = new ListPlacesUseCase(placeRepository);
const getUseCase = new GetPlaceUseCase(placeRepository);
const createUseCase = new CreatePlaceUseCase(placeRepository, categoryRepository);
const updateUseCase = new UpdatePlaceUseCase(placeRepository, categoryRepository);
const deleteUseCase = new DeletePlaceUseCase(placeRepository);
const addPhotoUseCase = new AddPlacePhotoUseCase(placeRepository);
const deletePhotoUseCase = new DeletePlacePhotoUseCase(placeRepository);
const getExcursionInfoUseCase = new GetExcursionInfoUseCase(excursionInfoRepository);
const upsertExcursionInfoUseCase = new UpsertExcursionInfoUseCase(excursionInfoRepository, placeRepository);

export const placeRouter = Router();

placeRouter.get('/places', validateQuery(listPlacesQuerySchema), async (req, res, next) => {
  try {
    const q = (req as any).validatedQuery;
    const result = await listUseCase.execute({
      categorySlug: q.category,
      search: q.search,
      lat: q.lat,
      lng: q.lng,
      radiusKm: q.radius,
      page: q.page,
      limit: q.limit,
    });
    res.json({
      success: true,
      data: result.items,
      meta: { page: result.page, limit: result.limit, total: result.total },
    });
  } catch (err) {
    next(err);
  }
});

placeRouter.get('/places/:id', async (req, res, next) => {
  try {
    const place = await getUseCase.execute(Number(req.params.id));
    res.json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
});

placeRouter.post(
  '/places',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  validateBody(createPlaceSchema),
  async (req, res, next) => {
    try {
      const place = await createUseCase.execute({ ...req.body, createdById: req.auth!.userId });
      res.status(201).json({ success: true, data: place });
    } catch (err) {
      next(err);
    }
  }
);

placeRouter.patch(
  '/places/:id',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  validateBody(updatePlaceSchema),
  async (req, res, next) => {
    try {
      const place = await updateUseCase.execute(Number(req.params.id), req.body);
      res.json({ success: true, data: place });
    } catch (err) {
      next(err);
    }
  }
);

placeRouter.delete('/places/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    await deleteUseCase.execute(Number(req.params.id));
    res.json({ success: true, data: { message: 'Lieu supprimé' } });
  } catch (err) {
    next(err);
  }
});

placeRouter.post(
  '/places/:id/photos',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  validateBody(addPhotoSchema),
  async (req, res, next) => {
    try {
      const place = await addPhotoUseCase.execute(Number(req.params.id), req.body.url, req.body.position);
      res.status(201).json({ success: true, data: place });
    } catch (err) {
      next(err);
    }
  }
);

placeRouter.delete('/photos/:id', authenticate, authorize('ADMIN', 'MODERATOR'), async (req, res, next) => {
  try {
    await deletePhotoUseCase.execute(Number(req.params.id));
    res.json({ success: true, data: { message: 'Photo supprimée' } });
  } catch (err) {
    next(err);
  }
});

// Infos d'excursion (Gorges de Kola, Parc de la Bénoué, etc.) : lecture publique, édition Admin
placeRouter.get('/places/:id/excursion', async (req, res, next) => {
  try {
    const info = await getExcursionInfoUseCase.execute(Number(req.params.id));
    res.json({ success: true, data: info });
  } catch (err) {
    next(err);
  }
});

placeRouter.put(
  '/places/:id/excursion',
  authenticate,
  authorize('ADMIN'),
  validateBody(upsertExcursionInfoSchema),
  async (req, res, next) => {
    try {
      const info = await upsertExcursionInfoUseCase.execute(Number(req.params.id), req.body);
      res.json({ success: true, data: info });
    } catch (err) {
      next(err);
    }
  }
);
