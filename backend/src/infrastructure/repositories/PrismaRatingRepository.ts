import { prisma } from '@infrastructure/prisma/client';
import { RatingRepository } from '@domain/repositories/InteractionRepositories';
import { RatingSummary } from '@domain/entities/Interaction';

export class PrismaRatingRepository implements RatingRepository {
  async upsert(userId: number, placeId: number, stars: number): Promise<void> {
    await prisma.rating.upsert({
      where: { userId_placeId: { userId, placeId } },
      update: { stars },
      create: { userId, placeId, stars },
    });
  }

  async summary(placeId: number): Promise<RatingSummary> {
    const result = await prisma.rating.aggregate({
      where: { placeId },
      _avg: { stars: true },
      _count: { stars: true },
    });
    return {
      average: result._avg.stars ? Math.round(result._avg.stars * 10) / 10 : 0,
      count: result._count.stars,
    };
  }
}
