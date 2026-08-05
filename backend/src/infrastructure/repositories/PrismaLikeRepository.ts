import { prisma } from '@infrastructure/prisma/client';
import { LikeRepository } from '@domain/repositories/InteractionRepositories';

export class PrismaLikeRepository implements LikeRepository {
  async exists(userId: number, placeId: number): Promise<boolean> {
    const found = await prisma.like.findUnique({
      where: { userId_placeId: { userId, placeId } },
    });
    return Boolean(found);
  }

  async create(userId: number, placeId: number): Promise<void> {
    await prisma.like.create({ data: { userId, placeId } });
  }

  async delete(userId: number, placeId: number): Promise<void> {
    await prisma.like.deleteMany({ where: { userId, placeId } });
  }

  countByPlace(placeId: number): Promise<number> {
    return prisma.like.count({ where: { placeId } });
  }
}
