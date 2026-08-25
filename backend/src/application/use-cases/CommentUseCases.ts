import { CommentRepository, CommentLikeRepository } from '@domain/repositories/InteractionRepositories';
import { PlaceRepository } from '@domain/repositories/PlaceRepository';
import { AppError } from '@presentation/middlewares/errorHandler';
import { sanitizePlainText } from '@infrastructure/security/sanitizeText';

export class ListCommentsUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}
  execute(placeId: number, page: number, limit: number, currentUserId?: number) {
    return this.commentRepository.listByPlace(placeId, page, limit, currentUserId);
  }
}

export class CreateCommentUseCase {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly placeRepository: PlaceRepository
  ) {}

  async execute(userId: number, placeId: number, content: string) {
    const place = await this.placeRepository.findById(placeId);
    if (!place) {
      throw new AppError(404, 'PLACE_NOT_FOUND', 'Lieu introuvable');
    }
    return this.commentRepository.create(userId, placeId, sanitizePlainText(content));
  }
}

function assertCanModerate(
  comment: { userId: number },
  requester: { userId: number; role: string }
) {
  const isOwner = comment.userId === requester.userId;
  const isModerator = requester.role === 'ADMIN' || requester.role === 'MODERATOR';
  if (!isOwner && !isModerator) {
    throw new AppError(403, 'FORBIDDEN', "Tu n'as pas le droit de modifier ce commentaire");
  }
}

export class UpdateCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(commentId: number, content: string, requester: { userId: number; role: string }) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new AppError(404, 'COMMENT_NOT_FOUND', 'Commentaire introuvable');
    }
    assertCanModerate(comment, requester);
    return this.commentRepository.update(commentId, sanitizePlainText(content));
  }
}

export class DeleteCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(commentId: number, requester: { userId: number; role: string }) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new AppError(404, 'COMMENT_NOT_FOUND', 'Commentaire introuvable');
    }
    assertCanModerate(comment, requester);
    await this.commentRepository.delete(commentId);
  }
}

export class LikeCommentUseCase {
  constructor(
    private readonly commentLikeRepository: CommentLikeRepository,
    private readonly commentRepository: CommentRepository
  ) {}

  async execute(userId: number, commentId: number): Promise<{ likeCount: number }> {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new AppError(404, 'COMMENT_NOT_FOUND', 'Commentaire introuvable');
    }
    await this.commentLikeRepository.create(userId, commentId);
    const likeCount = await this.commentLikeRepository.countByComment(commentId);
    return { likeCount };
  }
}

export class UnlikeCommentUseCase {
  constructor(private readonly commentLikeRepository: CommentLikeRepository) {}

  async execute(userId: number, commentId: number): Promise<{ likeCount: number }> {
    await this.commentLikeRepository.delete(userId, commentId);
    const likeCount = await this.commentLikeRepository.countByComment(commentId);
    return { likeCount };
  }
}