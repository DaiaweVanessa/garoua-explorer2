import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { fetchFavorites } from '@/services/places';
import { Place } from '@/types';
import { PlaceCard } from '@/components/PlaceCard';

export default function Favorites() {
  const { ready } = useRequireAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    setLoading(true);
    fetchFavorites()
      .then(setPlaces)
      .catch(() => setError('Impossible de charger tes favoris pour le moment.'))
      .finally(() => setLoading(false));
  }, [ready]);

  if (!ready) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-laterite">Tes lieux</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-indigo md:text-4xl">Favoris</h1>

      <div className="mt-8 space-y-4">
        {loading && <p className="font-sans text-sm text-ink/50">Chargement...</p>}
        {error && <p className="font-sans text-sm text-laterite">{error}</p>}

        {!loading && !error && places.length === 0 && (
          <div className="rounded-2xl border border-dashed border-indigo/15 px-6 py-14 text-center">
            <p className="font-sans text-sm text-ink/60">
              Tu n'as encore aucun favori. Explore Garoua et ajoute les lieux qui t'intéressent.
            </p>
            <Link to="/lieux" className="btn-primary mt-5 inline-flex">
              Explorer
            </Link>
          </div>
        )}

        {places.map((place) => (
          <PlaceCard key={place.id} place={place} favorited />
        ))}
      </div>
    </div>
  );
}