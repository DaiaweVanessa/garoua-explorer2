import { RatingRepository } from '@domain/repositories/InteractionRepositories';
import { PlaceRepository } from '@domain/repositories/PlaceRepository';
import { AppError } from '@presentation/middlewares/errorHandler';

export class RatePlaceUseCase {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly placeRepository: PlaceRepository
  ) {}

  async execute(userId: number, placeId: number, stars: number) {
    const place = await this.placeRepository.findById(placeId);
    if (!place) {
      throw new AppError(404, 'PLACE_NOT_FOUND', 'Lieu introuvable');
    }
    await this.ratingRepository.upsert(userId, placeId, stars);
    return this.ratingRepository.summary(placeId);
  }
}

export class GetRatingSummaryUseCase {
  constructor(private readonly ratingRepository: RatingRepository) {}
  execute(placeId: number) {
    return this.ratingRepository.summary(placeId);
  }
}
