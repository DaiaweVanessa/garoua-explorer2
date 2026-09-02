import { FormEvent, useState } from 'react';
import { Comment } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { addComment, deleteComment, likeComment, unlikeComment, updateComment } from '@/services/places';

interface CommentItemProps {
  comment: Comment;
  placeId: number;
  onChanged: () => void;
  isReply?: boolean;
}

export function CommentItem({ comment, placeId, onChanged, isReply = false }: CommentItemProps) {
  const { user, isAuthenticated } = useAuth();
  const isOwner = user?.id === comment.userId;
  const canModerate = user?.role === 'ADMIN' || user?.role === 'MODERATOR';
  const canEdit = isOwner;
  const canDelete = isOwner || canModerate;

  const [liked, setLiked] = useState(comment.isLikedByMe);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [likeBusy, setLikeBusy] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [replySubmitting, setReplySubmitting] = useState(false);

  async function handleToggleLike() {
    if (!isAuthenticated || likeBusy) return;
    setLikeBusy(true);
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => c + (wasLiked ? -1 : 1));
    try {
      const result = wasLiked ? await unlikeComment(comment.id) : await likeComment(comment.id);
      setLikeCount(result.likeCount);
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => c + (wasLiked ? 1 : -1));
    } finally {
      setLikeBusy(false);
    }
  }

  async function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editContent.trim()) return;
    setEditSubmitting(true);
    try {
      await updateComment(comment.id, editContent.trim());
      setEditing(false);
      onChanged();
    } catch {
      alert("Impossible de modifier le commentaire.");
    } finally {
      setEditSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Supprimer ce commentaire ? Cette action est irréversible.')) return;
    try {
      await deleteComment(comment.id);
      onChanged();
    } catch {
      alert('Impossible de supprimer le commentaire.');
    }
  }

  async function handleReplySubmit(e: FormEvent) {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setReplySubmitting(true);
    try {
      await addComment(placeId, replyContent.trim(), comment.id);
      setReplyContent('');
      setReplying(false);
      onChanged();
    } catch {
      alert("Impossible d'envoyer la réponse.");
    } finally {
      setReplySubmitting(false);
    }
  }

  return (
    <div className={isReply ? 'ml-10 mt-4 border-l-2 border-indigo/10 pl-4' : 'border-b border-indigo/10 pb-5'}>
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo font-display text-sm text-sable">
          {comment.user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-sans text-sm font-semibold text-ink">{comment.user.name}</p>
          <p className="font-mono text-xs text-ink/40">
            {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleEditSubmit} className="mt-3">
          <textarea
            rows={2}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full rounded-xl border border-indigo/15 bg-sable-light px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:ring-2 focus:ring-laterite"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="submit"
              disabled={editSubmitting || !editContent.trim()}
              className="btn-primary !px-4 !py-1.5 text-xs disabled:opacity-60"
            >
              {editSubmitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setEditContent(comment.content);
              }}
              className="font-sans text-xs text-ink/50 hover:text-ink"
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink/75">{comment.content}</p>
      )}

      <div className="mt-2 flex items-center gap-4 font-sans text-xs">
        <button
          onClick={handleToggleLike}
          disabled={!isAuthenticated || likeBusy}
          className={`flex items-center gap-1 font-semibold transition-colors disabled:opacity-50 ${
            liked ? 'text-laterite' : 'text-ink/50 hover:text-laterite'
          }`}
        >
          <span aria-hidden>{liked ? '❤️' : '🤍'}</span>
          {likeCount > 0 ? likeCount : ''} J'aime
        </button>

        {!isReply && isAuthenticated && (
          <button
            onClick={() => setReplying((r) => !r)}
            className="font-semibold text-ink/50 hover:text-indigo"
          >
            Répondre
          </button>
        )}

        {canEdit && !editing && (
          <button onClick={() => setEditing(true)} className="font-semibold text-ink/50 hover:text-indigo">
            Modifier
          </button>
        )}

        {canDelete && (
          <button onClick={handleDelete} className="font-semibold text-ink/50 hover:text-laterite">
            Supprimer
          </button>
        )}
      </div>

      {replying && (
        <form onSubmit={handleReplySubmit} className="mt-3">
          <textarea
            rows={2}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Ta réponse..."
            autoFocus
            className="w-full rounded-xl border border-indigo/15 bg-sable-light px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-laterite"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="submit"
              disabled={replySubmitting || !replyContent.trim()}
              className="btn-primary !px-4 !py-1.5 text-xs disabled:opacity-60"
            >
              {replySubmitting ? 'Envoi...' : 'Répondre'}
            </button>
            <button
              type="button"
              onClick={() => setReplying(false)}
              className="font-sans text-xs text-ink/50 hover:text-ink"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {comment.replies.length > 0 && (
        <div>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} placeId={placeId} onChanged={onChanged} isReply />
          ))}
        </div>
      )}
    </div>
  );
}