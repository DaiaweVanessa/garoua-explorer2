import { prisma } from '@infrastructure/prisma/client';
import { CommentLikeRepository } from '@domain/repositories/InteractionRepositories';

export class PrismaCommentLikeRepository implements CommentLikeRepository {
  async exists(userId: number, commentId: number): Promise<boolean> {
    const like = await prisma.commentLike.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });
    return Boolean(like);
  }

  async create(userId: number, commentId: number): Promise<void> {
    await prisma.commentLike.upsert({
      where: { userId_commentId: { userId, commentId } },
      create: { userId, commentId },
      update: {},
    });
  }

  async delete(userId: number, commentId: number): Promise<void> {
    await prisma.commentLike.deleteMany({ where: { userId, commentId } });
  }

  async countByComment(commentId: number): Promise<number> {
    return prisma.commentLike.count({ where: { commentId } });
  }
}