export interface Comment {
  id: number;
  userId: number;
  placeId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: { id: number; name: string; avatarUrl: string | null };
  likeCount: number;
  isLikedByMe: boolean;
}

export interface RatingSummary {
  average: number;
  count: number;
}