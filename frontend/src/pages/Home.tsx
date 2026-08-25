import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WeatherCard } from '@/components/WeatherCard';

const categories = [
  { slug: 'sites-touristiques', label: 'Sites touristiques', icon: '🏛️' },
  { slug: 'hotels', label: 'Hôtels', icon: '🏨' },
  { slug: 'restaurants', label: 'Restaurants', icon: '🍲' },
  { slug: 'marches', label: 'Marchés', icon: '🧺' },
  { slug: 'musees', label: 'Musées', icon: '🖼️' },
  { slug: 'lieux-religieux', label: 'Lieux religieux', icon: '🕌' },
];

// Remplace cet ID par celui de la vraie video YouTube une fois disponible
// (dans l'URL youtube.com/watch?v=XXXXXXXXXXX, XXXXXXXXXXX est l'ID)
const PRESENTATION_VIDEO_ID = 'dzpX7DaGwP0';

const features = [
  {
    title: 'Recherche géolocalisée',
    text: 'Trouve ce qui est vraiment proche de toi, avec la distance exacte calculée en temps réel.',
  },
  {
    title: 'Avis vérifiés',
    text: 'Des avis et notes laissés par de vrais visiteurs de Garoua, pas des recommandations génériques.',
  },
  {
    title: 'Excursions organisées',
    text: 'Gorges de Kola, Parc de la Bénoué : distance, coût, meilleure période, tout est indiqué.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    navigate(search ? `/lieux?search=${encodeURIComponent(search)}` : '/lieux');
  }

  return (
    <div>
      {/* HERO - photo au format portrait d'origine, jamais recadree */}
      <section className="bg-sable px-5 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-12 md:pt-16">
        <div
          className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-[1.5rem] shadow-card sm:max-w-sm sm:rounded-[2rem] md:max-w-md"
          style={{ aspectRatio: '720 / 889' }}
        >
          <img
            src="/images/hero.jpg"
            alt="Panneau I love Garoua City"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 82% 66% at 50% 34%, rgba(250,246,236,0.94) 0%, rgba(250,246,236,0.65) 42%, rgba(250,246,236,0) 78%)',
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex flex-col items-center px-5 pt-7 text-center sm:px-6 sm:pt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-laterite sm:text-xs">
              Nord-Cameroun · Région du Nord
            </p>
            <h1 className="mt-3 font-display text-2xl font-semibold uppercase leading-tight tracking-wide text-indigo sm:mt-4 sm:text-3xl md:text-4xl">
              Bienvenue sur
              <br />
              Garoua Explorer
            </h1>
            <p className="mt-3 max-w-[210px] font-sans text-sm text-ink/75 sm:mt-4 sm:max-w-xs sm:text-base">
              Votre guide personnel pour découvrir le cœur battant du Nord Cameroun.
            </p>
          </div>
        </div>
      </section>

      {/* METEO */}
      <section className="px-6 pt-8">
        <WeatherCard />
      </section>

      {/* RECHERCHE RAPIDE */}
      <section className="mx-auto max-w-3xl px-6 py-14">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un lieu, un quartier, une envie..."
            className="w-full rounded-full border border-indigo/15 bg-white px-6 py-4 font-sans text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-laterite"
          />
          <button type="submit" className="btn-primary shrink-0">
            Rechercher
          </button>
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/lieux?category=${c.slug}`}
              className="rounded-full border border-indigo/15 px-4 py-2 font-sans text-sm text-indigo/70 transition-colors hover:border-laterite hover:text-laterite"
            >
              <span className="mr-1.5">{c.icon}</span>
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* VIDEO DE PRESENTATION */}
      <section className="mx-auto max-w-4xl px-6 py-4">
        <h2 className="text-center font-display text-2xl font-semibold text-indigo sm:text-3xl">
          Garoua en vidéo
        </h2>
        <div className="mx-auto mt-6 aspect-video w-full overflow-hidden rounded-2xl shadow-card">
          {PRESENTATION_VIDEO_ID ? (
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${PRESENTATION_VIDEO_ID}`}
              title="Présentation de Garoua Explorer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-indigo/5 text-center">
              <span className="text-3xl">🎬</span>
              <p className="font-sans text-sm text-indigo/50">Vidéo de présentation bientôt disponible</p>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="font-display text-3xl font-semibold text-indigo">
          Pensé pour explorer, pas pour scroller
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card p-8">
              <h3 className="font-display text-xl font-semibold text-indigo">{f.title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ink/70">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA EXCURSIONS */}
      <section className="bg-laterite">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="font-display text-3xl font-semibold text-sable md:text-4xl">
            Envie de sortir de la ville ?
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-sans text-sable/90">
            Gorges de Kola, Parc national de la Bénoué, Lac de Lagdo — on te dit exactement comment y aller.
          </p>
          <Link to="/excursions" className="btn-secondary !border-sable !text-sable hover:!bg-sable hover:!text-laterite mt-8 inline-flex">
            Voir les excursions
          </Link>
        </div>
      </section>
    </div>
  );
}