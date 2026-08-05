import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchCategories, fetchPlaces } from '@/services/places';
import { Category, Place } from '@/types';
import { PlaceCard } from '@/components/PlaceCard';
import { PlacesMap } from '@/components/PlacesMap';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') ?? '';
  const activeSearch = searchParams.get('search') ?? '';

  const [searchInput, setSearchInput] = useState(activeSearch);
  const [categories, setCategories] = useState<Category[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPlaces({ category: activeCategory || undefined, search: activeSearch || undefined, limit: 50 })
      .then((res) => setPlaces(res.items))
      .catch(() =>
        setError("Impossible de charger les lieux. Vérifie que l'API est accessible.")
      )
      .finally(() => setLoading(false));
  }, [activeCategory, activeSearch]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchInput) next.set('search', searchInput);
    else next.delete('search');
    setSearchParams(next);
  }

  function toggleCategory(slug: string) {
    const next = new URLSearchParams(searchParams);
    if (activeCategory === slug) next.delete('category');
    else next.set('category', slug);
    setSearchParams(next);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-indigo md:text-4xl">
        Explorer Garoua
      </h1>

      <form onSubmit={handleSearchSubmit} className="mt-6 flex max-w-lg gap-3">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Rechercher un lieu..."
          className="w-full rounded-full border border-indigo/15 bg-white px-5 py-3 font-sans text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-laterite"
        />
        <button type="submit" className="btn-primary !px-5 !py-3 text-sm">
          Rechercher
        </button>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.slug)}
            className={`rounded-full border px-4 py-1.5 font-sans text-sm transition-colors ${
              activeCategory === cat.slug
                ? 'border-laterite bg-laterite text-sable'
                : 'border-indigo/15 text-indigo/70 hover:border-laterite hover:text-laterite'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          {loading && <p className="font-sans text-sm text-ink/50">Chargement...</p>}
          {error && <p className="font-sans text-sm text-laterite">{error}</p>}
          {!loading && !error && places.length === 0 && (
            <p className="font-sans text-sm text-ink/50">Aucun lieu trouvé pour cette recherche.</p>
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
