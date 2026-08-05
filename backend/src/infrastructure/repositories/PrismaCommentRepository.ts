import { prisma } from '@infrastructure/prisma/client';
import { CommentRepository, PaginatedComments } from '@domain/repositories/InteractionRepositories';
import { Comment } from '@domain/entities/Interaction';

const commentInclude = {
  user: { select: { id: true, name: true, avatarUrl: true } },
};

export class PrismaCommentRepository implements CommentRepository {
  async listByPlace(placeId: number, page: number, limit: number): Promise<PaginatedComments> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where: { placeId },
        include: commentInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where: { placeId } }),
    ]);
    return { items, total, page, limit };
  }

  findById(id: number): Promise<Comment | null> {
    return prisma.comment.findUnique({ where: { id }, include: commentInclude });
  }

  create(userId: number, placeId: number, content: string): Promise<Comment> {
    return prisma.comment.create({
      data: { userId, placeId, content },
      include: commentInclude,
    });
  }

  update(id: number, content: string): Promise<Comment> {
    return prisma.comment.update({
      where: { id },
      data: { content },
      include: commentInclude,
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.comment.delete({ where: { id } });
  }
}
