import { Router } from 'express';
import { PrismaFavoriteRepository } from '@infrastructure/repositories/PrismaFavoriteRepository';
import { PrismaLikeRepository } from '@infrastructure/repositories/PrismaLikeRepository';
import { PrismaPlaceRepository } from '@infrastructure/repositories/PrismaPlaceRepository';
import {
  AddFavoriteUseCase,
  RemoveFavoriteUseCase,
  ListFavoritesUseCase,
  AddLikeUseCase,
  RemoveLikeUseCase,
} from '@application/use-cases/FavoriteLikeUseCases';
import { authenticate } from '@presentation/middlewares/authenticate';

const favoriteRepository = new PrismaFavoriteRepository();
const likeRepository = new PrismaLikeRepository();
const placeRepository = new PrismaPlaceRepository();

const addFavoriteUseCase = new AddFavoriteUseCase(favoriteRepository, placeRepository);
const removeFavoriteUseCase = new RemoveFavoriteUseCase(favoriteRepository);
const listFavoritesUseCase = new ListFavoritesUseCase(favoriteRepository);
const addLikeUseCase = new AddLikeUseCase(likeRepository, placeRepository);
const removeLikeUseCase = new RemoveLikeUseCase(likeRepository);

export const favoriteLikeRouter = Router();

favoriteLikeRouter.post('/places/:id/favorite', authenticate, async (req, res, next) => {
  try {
    await addFavoriteUseCase.execute(req.auth!.userId, Number(req.params.id));
    res.status(201).json({ success: true, data: { message: 'Ajouté aux favoris' } });
  } catch (err) {
    next(err);
  }
});

favoriteLikeRouter.delete('/places/:id/favorite', authenticate, async (req, res, next) => {
  try {
    await removeFavoriteUseCase.execute(req.auth!.userId, Number(req.params.id));
    res.json({ success: true, data: { message: 'Retiré des favoris' } });
  } catch (err) {
    next(err);
  }
});

favoriteLikeRouter.get('/users/me/favorites', authenticate, async (req, res, next) => {
  try {
    const favorites = await listFavoritesUseCase.execute(req.auth!.userId);
    res.json({ success: true, data: favorites });
  } catch (err) {
    next(err);
  }
});

favoriteLikeRouter.post('/places/:id/like', authenticate, async (req, res, next) => {
  try {
    const likeCount = await addLikeUseCase.execute(req.auth!.userId, Number(req.params.id));
    res.status(201).json({ success: true, data: { likeCount } });
  } catch (err) {
    next(err);
  }
});

favoriteLikeRouter.delete('/places/:id/like', authenticate, async (req, res, next) => {
  try {
    const likeCount = await removeLikeUseCase.execute(req.auth!.userId, Number(req.params.id));
    res.json({ success: true, data: { likeCount } });
  } catch (err) {
    next(err);
  }
});
