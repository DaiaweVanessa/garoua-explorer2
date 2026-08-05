import { prisma } from '@infrastructure/prisma/client';
import { AdminStatsRepository } from '@domain/repositories/AdminStatsRepository';
import { AdminStats } from '@domain/entities/AdminStats';

export class PrismaAdminStatsRepository implements AdminStatsRepository {
  async getStats(): Promise<AdminStats> {
    const [
      users,
      places,
      categories,
      comments,
      ratings,
      events,
      transportOptions,
      topPlacesRaw,
      recentCommentsRaw,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.place.count(),
      prisma.category.count(),
      prisma.comment.count(),
      prisma.rating.count(),
      prisma.event.count(),
      prisma.transportOption.count(),
      prisma.place.findMany({
        take: 5,
        orderBy: { favorites: { _count: 'desc' } },
        select: {
          id: true,
          name: true,
          _count: { select: { favorites: true, likes: true } },
        },
      }),
      prisma.comment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: { select: { id: true, name: true } },
          place: { select: { id: true, name: true } },
        },
      }),
    ]);

    return {
      counts: { users, places, categories, comments, ratings, events, transportOptions },
      topPlaces: topPlacesRaw.map((p) => ({
        id: p.id,
        name: p.name,
        favoriteCount: p._count.favorites,
        likeCount: p._count.likes,
      })),
      recentComments: recentCommentsRaw,
    };
  }
}
