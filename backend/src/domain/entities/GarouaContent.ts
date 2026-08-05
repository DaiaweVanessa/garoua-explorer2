export interface ExcursionInfo {
  id: number;
  placeId: number;
  history: string | null;
  distanceKm: number | null;
  travelTimeMin: number | null;
  recommendedTransport: string | null;
  estimatedCost: string | null;
  practicalTips: string | null;
  bestPeriod: string | null;
}

export interface CityInfo {
  id: number;
  history: string | null;
  culture: string | null;
  gastronomy: string | null;
  climate: string | null;
  districts: string | null;
  updatedAt: Date;
}
