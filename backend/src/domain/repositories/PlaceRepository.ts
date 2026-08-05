import { PlaceWithRelations } from '@domain/entities/Place';

export interface PlaceFilters {
  categorySlug?: string;
  search?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface CreatePlaceInput {
  name: string;
  description?: string | null;
  categoryId: number;
  latitude: number;
  longitude: number;
  address?: string | null;
  phone?: string | null;
  openingHours?: string | null;
  createdById: number;
}

export interface UpdatePlaceInput {
  name?: string;
  description?: string | null;
  categoryId?: number;
  latitude?: number;
  longitude?: number;
  address?: string | null;
  phone?: string | null;
  openingHours?: string | null;
}

export interface PlaceRepository {
  findMany(filters: PlaceFilters): Promise<PaginatedResult<PlaceWithRelations>>;
  findById(id: number): Promise<PlaceWithRelations | null>;
  create(input: CreatePlaceInput): Promise<PlaceWithRelations>;
  update(id: number, input: UpdatePlaceInput): Promise<PlaceWithRelations>;
  delete(id: number): Promise<void>;
  addPhoto(placeId: number, url: string, position: number): Promise<void>;
  deletePhoto(photoId: number): Promise<void>;
}
