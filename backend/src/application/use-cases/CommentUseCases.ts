import { CommentRepository } from '@domain/repositories/InteractionRepositories';
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

  async execute(userId: number, placeId: number, content: string, parentId?: number | null) {
    const place = await this.placeRepository.findById(placeId);
    if (!place) {
      throw new AppError(404, 'PLACE_NOT_FOUND', 'Lieu introuvable');
    }

    if (parentId) {
      const parent = await this.commentRepository.findById(parentId);
      if (!parent || parent.placeId !== placeId) {
        throw new AppError(404, 'COMMENT_NOT_FOUND', 'Commentaire parent introuvable');
      }
      if (parent.parentId) {
        throw new AppError(400, 'INVALID_REPLY', 'Impossible de répondre à une réponse');
      }
    }

    return this.commentRepository.create(userId, placeId, sanitizePlainText(content), parentId ?? null);
  }
}

// Un commentaire ne peut être modifié/supprimé que par son auteur, ou par un Admin/Modérateur
function assertCanModerate(comment: { userId: number }, requester: { userId: number; role: string }) {
  const isOwner = comment.userId === requester.userId;
  const isModerator = requester.role === 'ADMIN' || requester.role === 'MODERATOR';
  if (!isOwner && !isModerator) {
    throw new AppError(403, 'FORBIDDEN', "Tu ne peux modifier que tes propres commentaires");
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
    return this.commentRepository.update(commentId, sanitizePlainText(content), requester.userId);
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
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(userId: number, commentId: number) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new AppError(404, 'COMMENT_NOT_FOUND', 'Commentaire introuvable');
    }
    await this.commentRepository.like(userId, commentId);
    const updated = await this.commentRepository.findById(commentId, userId);
    return { likeCount: updated!.likeCount };
  }
}

export class UnlikeCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(userId: number, commentId: number) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new AppError(404, 'COMMENT_NOT_FOUND', 'Commentaire introuvable');
    }
    await this.commentRepository.unlike(userId, commentId);
    const updated = await this.commentRepository.findById(commentId, userId);
    return { likeCount: updated!.likeCount };
  }
}