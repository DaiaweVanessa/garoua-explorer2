import { prisma } from '@infrastructure/prisma/client';
import { FavoriteRepository } from '@domain/repositories/InteractionRepositories';
import { PlaceWithRelations } from '@domain/entities/Place';

const placeInclude = {
  category: { select: { id: true, name: true, slug: true, icon: true } },
  photos: { orderBy: { position: 'asc' as const } },
};

export class PrismaFavoriteRepository implements FavoriteRepository {
  async exists(userId: number, placeId: number): Promise<boolean> {
    const found = await prisma.favorite.findUnique({
      where: { userId_placeId: { userId, placeId } },
    });
    return Boolean(found);
  }

  async create(userId: number, placeId: number): Promise<void> {
    await prisma.favorite.create({ data: { userId, placeId } });
  }

  async delete(userId: number, placeId: number): Promise<void> {
    await prisma.favorite.deleteMany({ where: { userId, placeId } });
  }

  async listByUser(userId: number): Promise<PlaceWithRelations[]> {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { place: { include: placeInclude } },
    });
    return favorites.map((f) => ({
      ...f.place,
      latitude: Number(f.place.latitude),
      longitude: Number(f.place.longitude),
    }));
  }
}
