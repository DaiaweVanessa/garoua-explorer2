import { Link } from 'react-router-dom';
import { Place } from '@/types';
import { FavoriteButton } from '@/components/FavoriteButton';
import { useAuth } from '@/hooks/useAuth';

interface PlaceCardProps {
  place: Place;
  favorited?: boolean;
}

export function PlaceCard({ place, favorited = false }: PlaceCardProps) {
  const { isAuthenticated } = useAuth();
  const cover = place.photos[0]?.url;

  return (
    <Link to={`/lieux/${place.id}`} className="card group relative flex gap-4 overflow-hidden p-3">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-sable-dark">
        {cover ? (
          <img src={cover} alt={place.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-2xl text-indigo/30">
            {place.name.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <span className="font-mono text-[11px] uppercase tracking-wide text-laterite">
          {place.category.name}
        </span>
        <h3 className="font-display text-lg font-semibold text-indigo group-hover:text-laterite">
          {place.name}
        </h3>
        {place.address && <p className="mt-0.5 truncate text-sm text-ink/60">{place.address}</p>}
        {place.distanceKm !== undefined && (
          <span className="mt-1 font-mono text-xs text-benoue">{place.distanceKm} km</span>
        )}
      </div>

      {isAuthenticated && (
        <div className="absolute right-3 top-3">
          <FavoriteButton placeId={place.id} initialFavorited={favorited} size="sm" />
        </div>
      )}
    </Link>
  );
}