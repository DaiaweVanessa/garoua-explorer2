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
    createdAt: Date;
    user: { id: number; name: string };
    place: { id: number; name: string };
  }>;
}
