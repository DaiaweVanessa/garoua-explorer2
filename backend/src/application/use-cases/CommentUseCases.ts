import { CommentRepository } from '@domain/repositories/InteractionRepositories';
import { PlaceRepository } from '@domain/repositories/PlaceRepository';
import { NotificationRepository } from '@domain/repositories/NotificationRepository';
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
    private readonly placeRepository: PlaceRepository,
    private readonly notificationRepository?: NotificationRepository
  ) {}

  async execute(userId: number, placeId: number, content: string, parentId?: number | null) {
    const place = await this.placeRepository.findById(placeId);
    if (!place) {
      throw new AppError(404, 'PLACE_NOT_FOUND', 'Lieu introuvable');
    }

    let parent = null;
    if (parentId) {
      parent = await this.commentRepository.findById(parentId);
      if (!parent || parent.placeId !== placeId) {
        throw new AppError(404, 'COMMENT_NOT_FOUND', 'Commentaire parent introuvable');
      }
    }

    const comment = await this.commentRepository.create(userId, placeId, sanitizePlainText(content), parentId ?? null);

    // Notifie l'auteur du commentaire parent, sauf s'il se repond a lui-meme
    if (parent && parent.userId !== userId && this.notificationRepository) {
      await this.notificationRepository.create({
        userId: parent.userId,
        type: 'COMMENT_REPLY',
        message: `${comment.user.name} a repondu a ton commentaire sur ${place.name}`,
        link: `/lieux/${placeId}`,
      });
    }

    return comment;
  }
}

// Un commentaire ne peut ÃƒÆ’Ã‚Âªtre modifiÃƒÆ’Ã‚Â©/supprimÃƒÆ’Ã‚Â© que par son auteur, ou par un Admin/ModÃƒÆ’Ã‚Â©rateur
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
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly notificationRepository?: NotificationRepository
  ) {}

  async execute(userId: number, commentId: number) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new AppError(404, 'COMMENT_NOT_FOUND', 'Commentaire introuvable');
    }
    await this.commentRepository.like(userId, commentId);

    if (comment.userId !== userId && this.notificationRepository) {
      await this.notificationRepository.create({
        userId: comment.userId,
        type: 'COMMENT_LIKE',
        message: 'Quelqu\'un a aime ton commentaire',
        link: `/lieux/${comment.placeId}`,
      });
    }

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