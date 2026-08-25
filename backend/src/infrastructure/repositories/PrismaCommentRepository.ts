import { prisma } from '@infrastructure/prisma/client';
import { CommentRepository, PaginatedComments } from '@domain/repositories/InteractionRepositories';
import { Comment } from '@domain/entities/Interaction';

const commentInclude = {
  user: { select: { id: true, name: true, avatarUrl: true } },
  _count: { select: { likes: true } },
};

function toEntity(comment: any, likedCommentIds: Set<number>): Comment {
  return {
    ...comment,
    likeCount: comment._count.likes,
    isLikedByMe: likedCommentIds.has(comment.id),
  };
}

export class PrismaCommentRepository implements CommentRepository {
  async listByPlace(
    placeId: number,
    page: number,
    limit: number,
    currentUserId?: number
  ): Promise<PaginatedComments> {
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

    let likedCommentIds = new Set<number>();
    if (currentUserId && items.length > 0) {
      const likes = await prisma.commentLike.findMany({
        where: { userId: currentUserId, commentId: { in: items.map((c) => c.id) } },
        select: { commentId: true },
      });
      likedCommentIds = new Set(likes.map((l) => l.commentId));
    }

    return { items: items.map((c) => toEntity(c, likedCommentIds)), total, page, limit };
  }

  async findById(id: number): Promise<Comment | null> {
    const comment = await prisma.comment.findUnique({ where: { id }, include: commentInclude });
    return comment ? toEntity(comment, new Set()) : null;
  }

  async create(userId: number, placeId: number, content: string): Promise<Comment> {
    const comment = await prisma.comment.create({
      data: { userId, placeId, content },
      include: commentInclude,
    });
    return toEntity(comment, new Set());
  }

  async update(id: number, content: string): Promise<Comment> {
    const comment = await prisma.comment.update({
      where: { id },
      data: { content },
      include: commentInclude,
    });
    return toEntity(comment, new Set());
  }

  async delete(id: number): Promise<void> {
    await prisma.comment.delete({ where: { id } });
  }
}