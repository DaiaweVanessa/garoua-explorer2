import { useEffect, useState } from 'react';
import { fetchCityInfo } from '@/services/content';
import { CityInfo } from '@/types';

const sections: { key: keyof CityInfo; title: string; icon: string }[] = [
  { key: 'history', title: 'Histoire', icon: '📜' },
  { key: 'culture', title: 'Culture', icon: '🎭' },
  { key: 'gastronomy', title: 'Gastronomie', icon: '🍲' },
  { key: 'climate', title: 'Climat', icon: '☀️' },
  { key: 'districts', title: 'Quartiers', icon: '🗺️' },
];

export default function Garoua() {
  const [info, setInfo] = useState<CityInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCityInfo()
      .then(setInfo)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-laterite">À propos</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-indigo md:text-4xl">
        Garoua, capitale du Nord
      </h1>
      <p className="mt-4 font-sans text-ink/70">
        Ville au bord de la Bénoué, porte d'entrée du Nord-Cameroun — son histoire, sa culture,
        ses saveurs et son climat.
      </p>

      {loading && <p className="mt-10 font-sans text-sm text-ink/50">Chargement...</p>}

      {!loading && !info && (
        <div className="mt-10 rounded-2xl border border-dashed border-indigo/15 px-6 py-14 text-center">
          <p className="font-sans text-sm text-ink/60">
            Le contenu sur Garoua n'est pas encore renseigné.
          </p>
        </div>
      )}

      {!loading && info && (
        <div className="mt-10 space-y-8">
          {sections
            .filter((s) => info[s.key])
            .map((s) => (
              <div key={s.key} className="card p-6">
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-indigo">
                  <span aria-hidden>{s.icon}</span>
                  {s.title}
                </h2>
                <p className="mt-3 whitespace-pre-line font-sans leading-relaxed text-ink/75">
                  {info[s.key] as string}
                </p>
              </div>
            ))}

          {sections.every((s) => !info[s.key]) && (
            <div className="rounded-2xl border border-dashed border-indigo/15 px-6 py-14 text-center">
              <p className="font-sans text-sm text-ink/60">
                Le contenu sur Garoua n'est pas encore renseigné.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}