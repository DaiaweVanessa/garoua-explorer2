import { FavoriteRepository, LikeRepository } from '@domain/repositories/InteractionRepositories';
import { PlaceRepository } from '@domain/repositories/PlaceRepository';
import { AppError } from '@presentation/middlewares/errorHandler';

async function assertPlaceExists(placeRepository: PlaceRepository, placeId: number) {
  const place = await placeRepository.findById(placeId);
  if (!place) {
    throw new AppError(404, 'PLACE_NOT_FOUND', 'Lieu introuvable');
  }
}

export class AddFavoriteUseCase {
  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly placeRepository: PlaceRepository
  ) {}

  async execute(userId: number, placeId: number) {
    await assertPlaceExists(this.placeRepository, placeId);
    const alreadyExists = await this.favoriteRepository.exists(userId, placeId);
    if (!alreadyExists) {
      await this.favoriteRepository.create(userId, placeId);
    }
  }
}

export class RemoveFavoriteUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}
  execute(userId: number, placeId: number) {
    return this.favoriteRepository.delete(userId, placeId);
  }
}

export class ListFavoritesUseCase {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}
  execute(userId: number) {
    return this.favoriteRepository.listByUser(userId);
  }
}

export class AddLikeUseCase {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly placeRepository: PlaceRepository
  ) {}

  async execute(userId: number, placeId: number) {
    await assertPlaceExists(this.placeRepository, placeId);
    const alreadyExists = await this.likeRepository.exists(userId, placeId);
    if (!alreadyExists) {
      await this.likeRepository.create(userId, placeId);
    }
    return this.likeRepository.countByPlace(placeId);
  }
}

export class RemoveLikeUseCase {
  constructor(private readonly likeRepository: LikeRepository) {}

  async execute(userId: number, placeId: number) {
    await this.likeRepository.delete(userId, placeId);
    return this.likeRepository.countByPlace(placeId);
  }
}
