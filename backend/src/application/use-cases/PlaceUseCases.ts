import { CategoryRepository } from '@domain/repositories/CategoryRepository';
import {
  CreatePlaceInput,
  PlaceFilters,
  PlaceRepository,
  UpdatePlaceInput,
} from '@domain/repositories/PlaceRepository';
import { AppError } from '@presentation/middlewares/errorHandler';
import { sanitizeNullable } from '@infrastructure/security/sanitizeText';

export class ListPlacesUseCase {
  constructor(private readonly placeRepository: PlaceRepository) {}
  execute(filters: PlaceFilters) {
    return this.placeRepository.findMany(filters);
  }
}

export class GetPlaceUseCase {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(id: number) {
    const place = await this.placeRepository.findById(id);
    if (!place) {
      throw new AppError(404, 'PLACE_NOT_FOUND', 'Lieu introuvable');
    }
    return place;
  }
}

export class CreatePlaceUseCase {
  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(input: CreatePlaceInput) {
    const category = await this.categoryRepository.findById(input.categoryId);
    if (!category) {
      throw new AppError(400, 'CATEGORY_NOT_FOUND', 'Catégorie introuvable');
    }
    return this.placeRepository.create({ ...input, description: sanitizeNullable(input.description) });
  }
}

export class UpdatePlaceUseCase {
  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(id: number, input: UpdatePlaceInput) {
    const existing = await this.placeRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'PLACE_NOT_FOUND', 'Lieu introuvable');
    }
    if (input.categoryId) {
      const category = await this.categoryRepository.findById(input.categoryId);
      if (!category) {
        throw new AppError(400, 'CATEGORY_NOT_FOUND', 'Catégorie introuvable');
      }
    }
    return this.placeRepository.update(id, { ...input, description: sanitizeNullable(input.description) });
  }
}

export class DeletePlaceUseCase {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(id: number) {
    const existing = await this.placeRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'PLACE_NOT_FOUND', 'Lieu introuvable');
    }
    await this.placeRepository.delete(id);
  }
}

export class AddPlacePhotoUseCase {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(placeId: number, url: string, position: number) {
    const existing = await this.placeRepository.findById(placeId);
    if (!existing) {
      throw new AppError(404, 'PLACE_NOT_FOUND', 'Lieu introuvable');
    }
    await this.placeRepository.addPhoto(placeId, url, position);
    return this.placeRepository.findById(placeId);
  }
}

export class DeletePlacePhotoUseCase {
  constructor(private readonly placeRepository: PlaceRepository) {}

  async execute(photoId: number) {
    await this.placeRepository.deletePhoto(photoId);
  }
}
