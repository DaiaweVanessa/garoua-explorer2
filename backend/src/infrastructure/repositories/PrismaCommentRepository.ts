import { prisma } from '@infrastructure/prisma/client';
import { CommentRepository, PaginatedComments } from '@domain/repositories/InteractionRepositories';
import { Comment } from '@domain/entities/Interaction';

const commentInclude = {
  user: { select: { id: true, name: true, avatarUrl: true } },
  likes: { select: { userId: true } },
  replies: {
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      likes: { select: { userId: true } },
    },
    orderBy: { createdAt: 'asc' as const },
  },
};

type RawComment = {
  id: number;
  userId: number;
  placeId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  parentId: number | null;
  user: { id: number; name: string; avatarUrl: string | null };
  likes: { userId: number }[];
  replies?: RawComment[];
};

function mapComment(raw: RawComment, currentUserId?: number): Comment {
  return {
    id: raw.id,
    userId: raw.userId,
    placeId: raw.placeId,
    content: raw.content,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    parentId: raw.parentId,
    user: raw.user,
    likeCount: raw.likes.length,
    isLikedByMe: currentUserId ? raw.likes.some((l) => l.userId === currentUserId) : false,
    replies: (raw.replies ?? []).map((r) => mapComment(r, currentUserId)),
  };
}

export class PrismaCommentRepository implements CommentRepository {
  async listByPlace(placeId: number, page: number, limit: number, currentUserId?: number): Promise<PaginatedComments> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.comment.findMany({
        where: { placeId, parentId: null },
        include: commentInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.comment.count({ where: { placeId, parentId: null } }),
    ]);
    return { items: items.map((c) => mapComment(c, currentUserId)), total, page, limit };
  }

  async findById(id: number, currentUserId?: number): Promise<Comment | null> {
    const raw = await prisma.comment.findUnique({ where: { id }, include: commentInclude });
    return raw ? mapComment(raw, currentUserId) : null;
  }

  async create(userId: number, placeId: number, content: string, parentId?: number | null): Promise<Comment> {
    const raw = await prisma.comment.create({
      data: { userId, placeId, content, parentId: parentId ?? null },
      include: commentInclude,
    });
    return mapComment(raw, userId);
  }

  async update(id: number, content: string, currentUserId?: number): Promise<Comment> {
    const raw = await prisma.comment.update({
      where: { id },
      data: { content },
      include: commentInclude,
    });
    return mapComment(raw, currentUserId);
  }

  async delete(id: number): Promise<void> {
    await prisma.comment.delete({ where: { id } });
  }

  async like(userId: number, commentId: number): Promise<void> {
    await prisma.commentLike.upsert({
      where: { userId_commentId: { userId, commentId } },
      create: { userId, commentId },
      update: {},
    });
  }

  async unlike(userId: number, commentId: number): Promise<void> {
    await prisma.commentLike.deleteMany({ where: { userId, commentId } });
  }

  async hasLiked(userId: number, commentId: number): Promise<boolean> {
    const like = await prisma.commentLike.findUnique({
      where: { userId_commentId: { userId, commentId } },
    });
    return Boolean(like);
  }
}