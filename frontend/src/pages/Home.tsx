import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWeather, WeatherData } from '@/services/weather';

const categories = [
  { slug: 'sites-touristiques', label: 'Sites', icon: '🏛️', color: '#c2410c' },
  { slug: 'hotels', label: 'Hôtels', icon: '🏨', color: '#185fa5' },
  { slug: 'restaurants', label: 'Resto', icon: '🍲', color: '#e0a514' },
  { slug: 'marches', label: 'Marchés', icon: '🧺', color: '#854919' },
  { slug: 'musees', label: 'Musées', icon: '🖼️', color: '#993565' },
  { slug: 'lieux-religieux', label: 'Religieux', icon: '🕌', color: '#3c3489' },
];

// Remplace cet ID par celui de la vraie video YouTube une fois disponible
// (dans l'URL youtube.com/watch?v=XXXXXXXXXXX, XXXXXXXXXXX est l'ID)
const PRESENTATION_VIDEO_ID = 'dzpX7DaGwP0';
// Mets true si la video ci-dessus est un YouTube Short (format vertical 9:16)
const PRESENTATION_VIDEO_IS_SHORT = true;

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185fa5" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 20l-5.447-2.724A1 1 0 0 1 3 16.382V5.618a1 1 0 0 1 1.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0 0 21 18.382V7.618a1 1 0 0 0-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    bg: '#185fa518',
    title: 'Recherche géolocalisée',
    text: 'Distance exacte, calculée en temps réel.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a3690b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 17.75l-6.172 3.245 1.179-6.873L2 9.755l6.9-1.003L12 2.5l3.1 6.252 6.9 1.003-5.007 4.367 1.179 6.873z" />
      </svg>
    ),
    bg: '#e0a51422',
    title: 'Avis vérifiés',
    text: 'Par de vrais visiteurs de Garoua.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f6e56" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 20l5-13 4 8 3-5 6 10H3z" />
        <circle cx="8" cy="5" r="2" />
      </svg>
    ),
    bg: '#0f6e5622',
    title: 'Excursions organisées',
    text: 'Distance, coût, période indiqués.',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeather().then(setWeather).catch(() => {});
  }, []);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    navigate(search ? `/lieux?search=${encodeURIComponent(search)}` : '/lieux');
  }

  function scrollToVideo() {
    document.getElementById('video-presentation')?.scrollIntoView({ behavior: 'smooth' });
  }

  const today = weather?.days?.[0];

  return (
    <div>
      {/* HERO avec meteo superposee et texte en bas */}
      <section className="relative h-[460px] overflow-hidden sm:h-[520px] md:h-[560px]">
        <img
          src="/images/hero.jpg"
          alt="Panneau I love Garoua City"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(15,10,8,0.35) 0%, rgba(15,10,8,0.05) 30%, rgba(15,10,8,0.15) 55%, rgba(15,10,8,0.88) 100%)',
          }}
          aria-hidden="true"
        />

        {weather && today && (
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-2xl bg-black/30 px-3 py-2 text-sable backdrop-blur-sm sm:right-6 sm:top-6">
            <span className="text-lg">{weather.icon}</span>
            <div>
              <p className="font-display text-sm font-semibold leading-none">{weather.currentTemp}°</p>
              <p className="mt-0.5 font-mono text-[9px] text-sable/75">
                Min {today.low}° · Max {today.high}°
              </p>
            </div>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 px-5 pb-8 sm:px-8 sm:pb-10 md:px-12">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-savane sm:text-xs">
            Nord-Cameroun
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold leading-tight text-sable sm:text-4xl md:text-5xl">
            Bienvenue sur
            <br />
            Garoua<span className="text-savane">.</span>Explorer
          </h1>
          <p className="mt-2 max-w-sm font-sans text-sm text-sable/80 sm:text-base">
            Votre guide personnel pour découvrir le cœur battant du Nord Cameroun.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Link to="/lieux" className="btn-primary">
              Explorer Garoua →
            </Link>
            <button
              onClick={scrollToVideo}
              aria-label="Voir la video de presentation"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/15 text-sable transition-colors hover:bg-white/25"
            >
              ▶
            </button>
          </div>
        </div>
      </section>

      {/* RECHERCHE + CATEGORIES sous le hero */}
      <section className="mx-auto max-w-3xl px-6 pt-6">
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

        <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={`/lieux?category=${c.slug}`}
              className="flex shrink-0 flex-col items-center gap-1.5"
            >
              <span
                className="grid h-14 w-14 place-items-center rounded-2xl text-xl transition-transform hover:scale-105"
                style={{ backgroundColor: `${c.color}1a` }}
              >
                {c.icon}
              </span>
              <span className="font-sans text-xs font-medium text-indigo">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURES en cartes horizontales */}
      <section className="mx-auto max-w-6xl px-6 pt-10">
        <h2 className="font-display text-xl font-semibold text-indigo sm:text-2xl">
          Pensé pour explorer, pas pour scroller
        </h2>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {features.map((f) => (
            <div key={f.title} className="card min-w-[220px] p-5">
              <span
                className="grid h-11 w-11 place-items-center rounded-xl"
                style={{ backgroundColor: f.bg }}
              >
                {f.icon}
              </span>
              <h3 className="mt-3 font-display text-base font-semibold text-indigo">{f.title}</h3>
              <p className="mt-1.5 font-sans text-sm leading-relaxed text-ink/70">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VIDEO DE PRESENTATION */}
      <section id="video-presentation" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-10">
        <h2 className="text-center font-display text-2xl font-semibold text-indigo sm:text-3xl">
          Garoua en vidéo
        </h2>
        <div
          className={`mx-auto mt-6 overflow-hidden rounded-2xl shadow-card ${
            PRESENTATION_VIDEO_IS_SHORT ? 'aspect-[9/16] max-w-xs' : 'aspect-video w-full'
          }`}
        >
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

      {/* CTA EXCURSIONS */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="relative overflow-hidden rounded-3xl bg-indigo px-6 py-8 sm:px-10 sm:py-10">
          <div
            className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-laterite/15"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-xl font-semibold text-sable sm:text-2xl">
                Envie de sortir de la ville ?
              </h2>
              <p className="mt-2 max-w-md font-sans text-sm text-sable/70">
                Gorges de Kola, Parc national de la Bénoué, Lac de Lagdo — on te dit exactement comment y aller.
              </p>
            </div>
            <Link to="/excursions" className="btn-primary shrink-0">
              Découvrir
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}