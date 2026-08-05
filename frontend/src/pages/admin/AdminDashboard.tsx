import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminStats } from '@/services/admin';
import { AdminStats } from '@/types';

const countLabels: { key: keyof AdminStats['counts']; label: string; icon: string }[] = [
  { key: 'users', label: 'Utilisateurs', icon: '👤' },
  { key: 'places', label: 'Lieux', icon: '📍' },
  { key: 'categories', label: 'Catégories', icon: '🏷️' },
  { key: 'comments', label: 'Avis', icon: '💬' },
  { key: 'ratings', label: 'Notes', icon: '⭐' },
  { key: 'events', label: 'Événements', icon: '📅' },
  { key: 'transportOptions', label: 'Options transport', icon: '🏍️' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="font-sans text-sm text-ink/50">Chargement...</p>;
  if (!stats) return <p className="font-sans text-sm text-laterite">Impossible de charger les statistiques.</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-indigo">Tableau de bord</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {countLabels.map((c) => (
          <div key={c.key} className="card p-4">
            <span className="text-xl">{c.icon}</span>
            <p className="mt-2 font-display text-2xl font-semibold text-indigo">{stats.counts[c.key]}</p>
            <p className="font-sans text-xs text-ink/50">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-lg font-semibold text-indigo">Lieux les plus appréciés</h2>
          <div className="mt-3 space-y-2">
            {stats.topPlaces.length === 0 && (
              <p className="font-sans text-sm text-ink/50">Pas encore assez de favoris/likes.</p>
            )}
            {stats.topPlaces.map((p, i) => (
              <Link
                key={p.id}
                to={`/lieux/${p.id}`}
                className="card flex items-center justify-between gap-3 p-3 hover:bg-sable-dark/30"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-ink/40">#{i + 1}</span>
                  <span className="font-sans text-sm font-semibold text-indigo">{p.name}</span>
                </div>
                <div className="flex gap-3 font-mono text-xs text-ink/50">
                  <span>♥ {p.favoriteCount}</span>
                  <span>👍 {p.likeCount}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-indigo">Avis récents</h2>
          <div className="mt-3 space-y-2">
            {stats.recentComments.length === 0 && (
              <p className="font-sans text-sm text-ink/50">Aucun avis pour l'instant.</p>
            )}
            {stats.recentComments.map((c) => (
              <div key={c.id} className="card p-3">
                <p className="font-sans text-sm text-ink/80">"{c.content}"</p>
                <p className="mt-1 font-mono text-[11px] text-ink/40">
                  {c.user.name} · {c.place.name} ·{' '}
                  {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}