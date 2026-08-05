import { ExcursionInfo, CityInfo } from '@domain/entities/GarouaContent';

export interface UpsertExcursionInfoInput {
  history?: string | null;
  distanceKm?: number | null;
  travelTimeMin?: number | null;
  recommendedTransport?: string | null;
  estimatedCost?: string | null;
  practicalTips?: string | null;
  bestPeriod?: string | null;
}

export interface ExcursionInfoRepository {
  findByPlaceId(placeId: number): Promise<ExcursionInfo | null>;
  upsert(placeId: number, input: UpsertExcursionInfoInput): Promise<ExcursionInfo>;
}

export interface UpsertCityInfoInput {
  history?: string | null;
  culture?: string | null;
  gastronomy?: string | null;
  climate?: string | null;
  districts?: string | null;
}

export interface CityInfoRepository {
  get(): Promise<CityInfo | null>;
  upsert(input: UpsertCityInfoInput): Promise<CityInfo>;
}
