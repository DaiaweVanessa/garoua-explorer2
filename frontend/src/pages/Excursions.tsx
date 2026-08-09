import { useEffect, useState } from 'react';
import { fetchPlaces } from '@/services/places';
import { Place } from '@/types';
import { PlaceCard } from '@/components/PlaceCard';
import { PlacesMap } from '@/components/PlacesMap';

export default function Excursions() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlaces({ excursion: true, limit: 50 })
      .then((res) => setPlaces(res.items))
      .catch(() => setError("Impossible de charger les excursions. Vérifie que l'API est accessible."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-laterite">Hors de la ville</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-indigo md:text-4xl">Excursions</h1>
      <p className="mt-3 max-w-2xl font-sans text-ink/70">
        Gorges de Kola, Parc national de la Bénoué, Lac de Lagdo... les sorties autour de Garoua,
        avec distance, coût estimé et meilleure période pour y aller.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          {loading && <p className="font-sans text-sm text-ink/50">Chargement...</p>}
          {error && <p className="font-sans text-sm text-laterite">{error}</p>}
          {!loading && !error && places.length === 0 && (
            <div className="rounded-2xl border border-dashed border-indigo/15 px-6 py-14 text-center">
              <p className="font-sans text-sm text-ink/60">
                Aucune excursion n'est encore renseignée.
              </p>
            </div>
          )}
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>

        <div className="h-[500px] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
          <PlacesMap places={places} />
        </div>
      </div>
    </div>
  );
}