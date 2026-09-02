import { api, ApiResponse } from './api';
import { Category, Comment, ExcursionInfo, Place, RatingSummary } from '@/types';

export interface PlaceFilters {
  category?: string;
  search?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  excursion?: boolean;
  page?: number;
  limit?: number;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await api.get<ApiResponse<Category[]>>('/categories');
  return res.data.data;
}

export async function fetchPlaces(filters: PlaceFilters): Promise<{ items: Place[]; total: number }> {
  const res = await api.get<ApiResponse<Place[]>>('/places', { params: filters });
  return { items: res.data.data, total: res.data.meta?.total ?? res.data.data.length };
}

export async function fetchPlace(id: number): Promise<Place> {
  const res = await api.get<ApiResponse<Place>>(`/places/${id}`);
  return res.data.data;
}

export async function fetchExcursionInfo(placeId: number): Promise<ExcursionInfo | null> {
  const res = await api.get<ApiResponse<ExcursionInfo | null>>(`/places/${placeId}/excursion`);
  return res.data.data;
}

export async function fetchRatingSummary(placeId: number): Promise<RatingSummary> {
  const res = await api.get<ApiResponse<RatingSummary>>(`/places/${placeId}/ratings/summary`);
  return res.data.data;
}

export async function fetchComments(
  placeId: number,
  page = 1,
  limit = 20
): Promise<{ items: Comment[]; total: number }> {
  const res = await api.get<ApiResponse<Comment[]>>(`/places/${placeId}/comments`, {
    params: { page, limit },
  });
  return { items: res.data.data, total: res.data.meta?.total ?? res.data.data.length };
}

export async function addComment(placeId: number, content: string, parentId?: number): Promise<Comment> {
  const res = await api.post<ApiResponse<Comment>>(`/places/${placeId}/comments`, { content, parentId });
  return res.data.data;
}

export async function likeComment(commentId: number): Promise<{ likeCount: number }> {
  const res = await api.post<ApiResponse<{ likeCount: number }>>(`/comments/${commentId}/like`);
  return res.data.data;
}

export async function unlikeComment(commentId: number): Promise<{ likeCount: number }> {
  const res = await api.delete<ApiResponse<{ likeCount: number }>>(`/comments/${commentId}/like`);
  return res.data.data;
}

export async function updateComment(commentId: number, content: string): Promise<Comment> {
  const res = await api.patch<ApiResponse<Comment>>(`/comments/${commentId}`, { content });
  return res.data.data;
}

export async function deleteComment(commentId: number): Promise<void> {
  await api.delete(`/comments/${commentId}`);
}

export async function ratePlace(placeId: number, stars: number): Promise<RatingSummary> {
  const res = await api.post<ApiResponse<RatingSummary>>(`/places/${placeId}/ratings`, { stars });
  return res.data.data;
}

export async function addFavorite(placeId: number): Promise<void> {
  await api.post(`/places/${placeId}/favorite`);
}

export async function removeFavorite(placeId: number): Promise<void> {
  await api.delete(`/places/${placeId}/favorite`);
}

export async function fetchFavorites(): Promise<Place[]> {
  const res = await api.get<ApiResponse<Place[]>>('/users/me/favorites');
  return res.data.data;
}