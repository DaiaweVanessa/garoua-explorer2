import { ExcursionInfoRepository, CityInfoRepository, UpsertExcursionInfoInput, UpsertCityInfoInput } from '@domain/repositories/GarouaContentRepositories';
import { PlaceRepository } from '@domain/repositories/PlaceRepository';
import { AppError } from '@presentation/middlewares/errorHandler';

export class GetExcursionInfoUseCase {
  constructor(private readonly excursionInfoRepository: ExcursionInfoRepository) {}

  async execute(placeId: number) {
    const info = await this.excursionInfoRepository.findByPlaceId(placeId);
    if (!info) {
      throw new AppError(404, 'EXCURSION_INFO_NOT_FOUND', "Pas d'informations d'excursion pour ce lieu");
    }
    return info;
  }
}

export class UpsertExcursionInfoUseCase {
  constructor(
    private readonly excursionInfoRepository: ExcursionInfoRepository,
    private readonly placeRepository: PlaceRepository
  ) {}

  async execute(placeId: number, input: UpsertExcursionInfoInput) {
    const place = await this.placeRepository.findById(placeId);
    if (!place) {
      throw new AppError(404, 'PLACE_NOT_FOUND', 'Lieu introuvable');
    }
    return this.excursionInfoRepository.upsert(placeId, input);
  }
}

export class GetCityInfoUseCase {
  constructor(private readonly cityInfoRepository: CityInfoRepository) {}

  async execute() {
    const info = await this.cityInfoRepository.get();
    // Retourne un objet vide plutôt qu'une erreur : contenu pas encore renseigné au tout début
    return (
      info ?? {
        id: 0,
        history: null,
        culture: null,
        gastronomy: null,
        climate: null,
        districts: null,
        updatedAt: null,
      }
    );
  }
}

export class UpdateCityInfoUseCase {
  constructor(private readonly cityInfoRepository: CityInfoRepository) {}

  execute(input: UpsertCityInfoInput) {
    return this.cityInfoRepository.upsert(input);
  }
}
