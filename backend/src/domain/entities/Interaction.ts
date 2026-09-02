export interface Comment {
  id: number;
  userId: number;
  placeId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  parentId: number | null;
  user: { id: number; name: string; avatarUrl: string | null };
  likeCount: number;
  isLikedByMe: boolean;
  replies: Comment[];
}

export interface RatingSummary {
  average: number;
  count: number;
}