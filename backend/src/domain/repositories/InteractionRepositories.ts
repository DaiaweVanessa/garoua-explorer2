import { Comment, RatingSummary } from '@domain/entities/Interaction';
import { PlaceWithRelations } from '@domain/entities/Place';

export interface FavoriteRepository {
  exists(userId: number, placeId: number): Promise<boolean>;
  create(userId: number, placeId: number): Promise<void>;
  delete(userId: number, placeId: number): Promise<void>;
  listByUser(userId: number): Promise<PlaceWithRelations[]>;
}

export interface LikeRepository {
  exists(userId: number, placeId: number): Promise<boolean>;
  create(userId: number, placeId: number): Promise<void>;
  delete(userId: number, placeId: number): Promise<void>;
  countByPlace(placeId: number): Promise<number>;
}

export interface PaginatedComments {
  items: Comment[];
  total: number;
  page: number;
  limit: number;
}

export interface CommentRepository {
  listByPlace(placeId: number, page: number, limit: number): Promise<PaginatedComments>;
  findById(id: number): Promise<Comment | null>;
  create(userId: number, placeId: number, content: string): Promise<Comment>;
  update(id: number, content: string): Promise<Comment>;
  delete(id: number): Promise<void>;
}

export interface RatingRepository {
  upsert(userId: number, placeId: number, stars: number): Promise<void>;
  summary(placeId: number): Promise<RatingSummary>;
}
