export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
}

export interface PlacePhoto {
  id: number;
  url: string;
  position: number;
}

export interface Place {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
  latitude: number;
  longitude: number;
  address: string | null;
  phone: string | null;
  openingHours: string | null;
  category: Category;
  photos: PlacePhoto[];
  distanceKm?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'MODERATOR' | 'USER';
  avatarUrl: string | null;
  createdAt: string;
}

export interface Comment {
  id: number;
  userId: number;
  placeId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: { id: number; name: string; avatarUrl: string | null };
}

export interface RatingSummary {
  average: number;
  count: number;
}

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
  updatedAt: string;
}

export type TransportType = 'MOTO_TAXI' | 'BUS' | 'AGENCY' | 'CAR_RENTAL' | 'AIRPORT';

export interface TransportOption {
  id: number;
  type: TransportType;
  name: string;
  description: string | null;
  basePrice: number;
  priceUnit: string;
  updatedAt: string;
}

export interface EventItem {
  id: number;
  title: string;
  description: string | null;
  placeId: number | null;
  startDate: string;
  endDate: string;
}

export interface AdminStats {
  counts: {
    users: number;
    places: number;
    categories: number;
    comments: number;
    ratings: number;
    events: number;
    transportOptions: number;
  };
  topPlaces: Array<{ id: number; name: string; favoriteCount: number; likeCount: number }>;
  recentComments: Array<{
    id: number;
    content: string;
    createdAt: string;
    user: { id: number; name: string };
    place: { id: number; name: string };
  }>;
}