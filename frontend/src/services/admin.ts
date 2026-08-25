import { api, ApiResponse } from './api';
import { AdminStats, Category, CityInfo, EventItem, ExcursionInfo, Place, TransportOption } from '@/types';

export async function fetchAdminStats(): Promise<AdminStats> {
  const res = await api.get<ApiResponse<AdminStats>>('/admin/stats');
  return res.data.data;
}

// --- Lieux ---
export interface PlaceInput {
  name: string;
  description?: string | null;
  categoryId: number;
  latitude: number;
  longitude: number;
  address?: string | null;
  phone?: string | null;
  openingHours?: string | null;
  videoUrl?: string | null;
}

export async function createPlace(input: PlaceInput): Promise<Place> {
  const res = await api.post<ApiResponse<Place>>('/places', input);
  return res.data.data;
}

export async function updatePlace(id: number, input: Partial<PlaceInput>): Promise<Place> {
  const res = await api.patch<ApiResponse<Place>>(`/places/${id}`, input);
  return res.data.data;
}

export async function deletePlace(id: number): Promise<void> {
  await api.delete(`/places/${id}`);
}

export async function addPlacePhoto(placeId: number, url: string, position = 0): Promise<Place> {
  const res = await api.post<ApiResponse<Place>>(`/places/${placeId}/photos`, { url, position });
  return res.data.data;
}

export async function deletePlacePhoto(photoId: number): Promise<void> {
  await api.delete(`/photos/${photoId}`);
}

export interface ExcursionInfoInput {
  history?: string | null;
  distanceKm?: number | null;
  travelTimeMin?: number | null;
  recommendedTransport?: string | null;
  estimatedCost?: string | null;
  practicalTips?: string | null;
  bestPeriod?: string | null;
}

export async function upsertExcursionInfo(placeId: number, input: ExcursionInfoInput): Promise<ExcursionInfo> {
  const res = await api.put<ApiResponse<ExcursionInfo>>(`/places/${placeId}/excursion`, input);
  return res.data.data;
}

// --- Catégories ---
export interface CategoryInput {
  name: string;
  slug: string;
  icon?: string | null;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  const res = await api.post<ApiResponse<Category>>('/categories', input);
  return res.data.data;
}

export async function updateCategory(id: number, input: Partial<CategoryInput>): Promise<Category> {
  const res = await api.patch<ApiResponse<Category>>(`/categories/${id}`, input);
  return res.data.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categories/${id}`);
}

// --- Contenu Garoua (singleton) ---
export interface CityInfoInput {
  history?: string | null;
  culture?: string | null;
  gastronomy?: string | null;
  climate?: string | null;
  districts?: string | null;
}

export async function updateCityInfo(input: CityInfoInput): Promise<CityInfo> {
  const res = await api.put<ApiResponse<CityInfo>>('/city-info', input);
  return res.data.data;
}

// --- Transport ---
export interface TransportInput {
  type: TransportOption['type'];
  name: string;
  description?: string | null;
  basePrice: number;
  priceUnit: string;
}

export async function createTransportOption(input: TransportInput): Promise<TransportOption> {
  const res = await api.post<ApiResponse<TransportOption>>('/transport', input);
  return res.data.data;
}

export async function updateTransportOption(id: number, input: Partial<TransportInput>): Promise<TransportOption> {
  const res = await api.patch<ApiResponse<TransportOption>>(`/transport/${id}`, input);
  return res.data.data;
}

export async function deleteTransportOption(id: number): Promise<void> {
  await api.delete(`/transport/${id}`);
}

// --- Événements ---
export interface EventInput {
  title: string;
  description?: string | null;
  placeId?: number | null;
  startDate: string;
  endDate: string;
}

export async function createEvent(input: EventInput): Promise<EventItem> {
  const res = await api.post<ApiResponse<EventItem>>('/events', input);
  return res.data.data;
}

export async function updateEvent(id: number, input: Partial<EventInput>): Promise<EventItem> {
  const res = await api.patch<ApiResponse<EventItem>>(`/events/${id}`, input);
  return res.data.data;
}

export async function deleteEvent(id: number): Promise<void> {
  await api.delete(`/events/${id}`);
}