import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  addComment,
  fetchComments,
  fetchExcursionInfo,
  fetchFavorites,
  fetchPlace,
  fetchRatingSummary,
  ratePlace,
} from '@/services/places';
import { Comment, ExcursionInfo, Place, RatingSummary } from '@/types';
import { PlacesMap } from '@/components/PlacesMap';
import { StarRating } from '@/components/StarRating';
import { FavoriteButton } from '@/components/FavoriteButton';
import { PhotoUploader } from '@/components/PhotoUploader';
import { useAuth } from '@/hooks/useAuth';
import { getYouTubeEmbedUrl, isYouTubeShort } from '@/lib/youtube';

export default function PlaceDetail() {
  const { id } = useParams<{ id: string }>();
  const placeId = Number(id);
  const { isAuthenticated, user } = useAuth();
  const canManagePhotos = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

  const [place, setPlace] = useState<Place | null>(null);
  const [rating, setRating] = useState<RatingSummary>({ average: 0, count: 0 });
  const [excursion, setExcursion] = useState<ExcursionInfo | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activePhoto, setActivePhoto] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(placeId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setActivePhoto(0);

    fetchPlace(placeId)
      .then((data) => {
        if (cancelled) return;
        setPlace(data);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    fetchRatingSummary(placeId)
      .then((data) => !cancelled && setRating(data))
      .catch(() => {});

    fetchExcursionInfo(placeId)
      .then((data) => !cancelled && setExcursion(data))
      .catch(() => !cancelled && setExcursion(null));

    fetchComments(placeId)
      .then((res) => !cancelled && setComments(res.items))
      .catch(() => {});

    if (isAuthenticated) {
      fetchFavorites()
        .then((favs) => !cancelled && setIsFavorited(favs.some((f) => f.id === placeId)))
        .catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [placeId, isAuthenticated]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24 text-center font-sans text-sm text-ink/50">
        Chargement du lieu...
      </div>
    );
  }

  if (notFound || !place) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-laterite">Erreur 404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold text-indigo">
          Ce lieu est introuvable
        </h1>
        <p className="mt-4 font-sans text-ink/60">
          Il a peut-être été retiré, ou l'adresse n'est pas correcte.
        </p>
        <Link to="/lieux" className="btn-primary mt-8 inline-flex">
          Retour à l'exploration
        </Link>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(place.videoUrl);
  const isShort = isYouTubeShort(place.videoUrl);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <nav className="font-sans text-sm text-ink/50">
        <Link to="/lieux" className="hover:text-laterite">
          Explorer
        </Link>{' '}
        / <span className="text-ink/70">{place.name}</span>
      </nav>

      {/* GALERIE */}
      <div className="mt-6">
        {place.photos.length > 0 ? (
          <div>
            <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-sable-dark">
              <img
                src={place.photos[activePhoto].url}
                alt={place.name}
                className="h-full w-full object-cover"
              />
            </div>
            {place.photos.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {place.photos.map((photo, i) => (
                  <button
                    key={photo.id}
                    onClick={() => setActivePhoto(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                      i === activePhoto ? 'border-laterite' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {canManagePhotos && (
              <div className="mt-4">
                <PhotoUploader
                  placeId={place.id}
                  photos={place.photos}
                  onPhotosChange={(photos) => setPlace((prev) => (prev ? { ...prev, photos } : prev))}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex aspect-[16/9] w-full items-center justify-center rounded-2xl bg-indigo/5">
            <span className="font-display text-6xl text-indigo/20">{place.name.charAt(0)}</span>
          </div>
        )}
        {canManagePhotos && place.photos.length === 0 && (
          <div className="mt-4">
            <PhotoUploader
              placeId={place.id}
              photos={place.photos}
              onPhotosChange={(photos) => setPlace((prev) => (prev ? { ...prev, photos } : prev))}
            />
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* COLONNE PRINCIPALE */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wide text-laterite">
                {place.category.name}
              </span>
              <h1 className="mt-2 font-display text-3xl font-semibold text-indigo md:text-4xl">
                {place.name}
              </h1>
            </div>
            {isAuthenticated && (
              <FavoriteButton placeId={place.id} initialFavorited={isFavorited} />
            )}
          </div>

          <div className="mt-3">
            <StarRating average={rating.average} count={rating.count} />
          </div>

          {place.description && (
            <p className="mt-6 max-w-2xl font-sans leading-relaxed text-ink/80">
              {place.description}
            </p>
          )}

          {embedUrl && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold text-indigo">Vidéo</h2>
              <div
                className={`mt-3 overflow-hidden rounded-2xl bg-black ${
                  isShort ? 'mx-auto aspect-[9/16] max-w-xs' : 'aspect-video w-full'
                }`}
              >
                <iframe
                  src={embedUrl}
                  title={`Vidéo de ${place.name}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {excursion && (
            <div className="mt-8 rounded-2xl border border-benoue/20 bg-benoue/5 p-6">
              <h2 className="font-display text-xl font-semibold text-benoue-dark">
                Excursion : ce qu'il faut savoir
              </h2>
              {excursion.history && (
                <p className="mt-3 font-sans text-sm leading-relaxed text-ink/70">
                  {excursion.history}
                </p>
              )}
              <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {excursion.distanceKm !== null && (
                  <InfoStat label="Distance" value={`${excursion.distanceKm} km`} />
                )}
                {excursion.travelTimeMin !== null && (
                  <InfoStat label="Trajet" value={`${excursion.travelTimeMin} min`} />
                )}
                {excursion.estimatedCost && (
                  <InfoStat label="Coût estimé" value={excursion.estimatedCost} />
                )}
                {excursion.recommendedTransport && (
                  <InfoStat label="Transport conseillé" value={excursion.recommendedTransport} />
                )}
                {excursion.bestPeriod && (
                  <InfoStat label="Meilleure période" value={excursion.bestPeriod} />
                )}
              </dl>
              {excursion.practicalTips && (
                <p className="mt-5 rounded-xl bg-white/60 p-4 font-sans text-sm text-ink/70">
                  💡 {excursion.practicalTips}
                </p>
              )}
            </div>
          )}

          {/* AVIS */}
          <div className="mt-10">
            <h2 className="font-display text-xl font-semibold text-indigo">
              Avis {comments.length > 0 && `(${comments.length})`}
            </h2>

            {isAuthenticated ? (
              <ReviewForm
                placeId={place.id}
                onRated={setRating}
                onCommented={(c) => setComments((prev) => [c, ...prev])}
              />
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-indigo/15 p-5 font-sans text-sm text-ink/60">
                <Link to="/connexion" className="font-semibold text-laterite hover:underline">
                  Connecte-toi
                </Link>{' '}
                pour laisser un avis ou une note sur ce lieu.
              </div>
            )}

            <div className="mt-6 space-y-5">
              {comments.length === 0 && (
                <p className="font-sans text-sm text-ink/50">
                  Aucun avis pour l'instant — sois le premier à en laisser un.
                </p>
              )}
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-indigo/10 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-indigo font-display text-sm text-sable">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-sans text-sm font-semibold text-ink">
                        {comment.user.name}
                      </p>
                      <p className="font-mono text-xs text-ink/40">
                        {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-ink/75">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLONNE LATÉRALE : INFOS PRATIQUES + CARTE */}
        <div className="space-y-6">
          <div className="card space-y-4 p-6">
            <h2 className="font-display text-lg font-semibold text-indigo">Infos pratiques</h2>
            {place.address && <PracticalInfo label="Adresse" value={place.address} />}
            {place.phone && <PracticalInfo label="Téléphone" value={place.phone} />}
            {place.openingHours && (
              <PracticalInfo label="Horaires" value={place.openingHours} />
            )}
            {!place.address && !place.phone && !place.openingHours && (
              <p className="font-sans text-sm text-ink/50">
                Aucune information pratique renseignée pour ce lieu.
              </p>
            )}
          </div>

          <div className="h-72 overflow-hidden rounded-2xl">
            <PlacesMap places={[place]} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewForm({
  placeId,
  onRated,
  onCommented,
}: {
  placeId: number;
  onRated: (summary: RatingSummary) => void;
  onCommented: (comment: Comment) => void;
}) {
  const [stars, setStars] = useState(0);
  const [hoverStars, setHoverStars] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingDone, setRatingDone] = useState(false);

  const [content, setContent] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitRating(value: number) {
    setStars(value);
    setRatingSubmitting(true);
    try {
      const summary = await ratePlace(placeId, value);
      onRated(summary);
      setRatingDone(true);
    } catch {
      setError("Impossible d'enregistrer la note.");
    } finally {
      setRatingSubmitting(false);
    }
  }

  async function handleCommentSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setCommentSubmitting(true);
    setError(null);
    try {
      const comment = await addComment(placeId, content.trim());
      onCommented(comment);
      setContent('');
    } catch {
      setError("Impossible d'envoyer l'avis.");
    } finally {
      setCommentSubmitting(false);
    }
  }

  return (
    <div className="mt-4 rounded-2xl border border-indigo/10 bg-white p-5">
      <p className="font-sans text-sm font-semibold text-indigo">Ta note</p>
      <div className="mt-1.5 flex items-center gap-2">
        <div className="flex text-2xl">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              disabled={ratingSubmitting}
              onMouseEnter={() => setHoverStars(n)}
              onMouseLeave={() => setHoverStars(0)}
              onClick={() => submitRating(n)}
              className="text-savane-dark transition-transform hover:scale-110 disabled:opacity-60"
              aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
            >
              {n <= (hoverStars || stars) ? '★' : '☆'}
            </button>
          ))}
        </div>
        {ratingDone && <span className="font-sans text-xs text-benoue-dark">Note enregistrée ✓</span>}
      </div>

      <form onSubmit={handleCommentSubmit} className="mt-5">
        <label htmlFor="review" className="font-sans text-sm font-semibold text-indigo">
          Ton avis
        </label>
        <textarea
          id="review"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Qu'as-tu pensé de ce lieu ?"
          className="mt-1.5 w-full rounded-xl border border-indigo/15 bg-sable-light px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-laterite"
        />
        {error && <p className="mt-2 font-sans text-sm text-laterite">{error}</p>}
        <button
          type="submit"
          disabled={commentSubmitting || !content.trim()}
          className="btn-primary mt-3 !px-5 !py-2.5 text-sm disabled:opacity-60"
        >
          {commentSubmitting ? 'Envoi...' : 'Publier mon avis'}
        </button>
      </form>
    </div>
  );
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-wide text-benoue-dark/70">
        {label}
      </dt>
      <dd className="mt-1 font-sans text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}

function PracticalInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-wide text-indigo/50">{label}</p>
      <p className="mt-0.5 font-sans text-sm text-ink/80">{value}</p>
    </div>
  );
}