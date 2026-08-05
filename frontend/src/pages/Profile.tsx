import { FormEvent, useEffect, useState } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile } from '@/services/user';
import { ApiError } from '@/services/api';
import { isAxiosError } from 'axios';

export default function Profile() {
  const { ready, user } = useRequireAuth();
  const { logout } = useAuth();

  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatarUrl(user.avatarUrl ?? '');
    }
  }, [user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      await updateProfile(user.id, { name, avatarUrl: avatarUrl || null });
      setSuccess(true);
    } catch (err) {
      if (isAxiosError<ApiError>(err) && err.response?.data?.error?.message) {
        setError(err.response.data.error.message);
      } else {
        setError('Impossible de mettre à jour le profil.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready || !user) return null;

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-laterite">Ton compte</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-indigo">Profil</h1>

      <div className="mt-8 flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-indigo font-display text-2xl text-sable">
          {avatarUrl ? (
            <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <p className="font-sans text-sm text-ink/50">Membre depuis</p>
          <p className="font-sans text-sm font-semibold text-indigo">
            {new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="font-sans text-sm font-semibold text-indigo">
            Nom
          </label>
          <input
            id="name"
            type="text"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-indigo/15 bg-white px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:ring-2 focus:ring-laterite"
          />
        </div>

        <div>
          <label htmlFor="email" className="font-sans text-sm font-semibold text-indigo">
            Email
          </label>
          <input
            id="email"
            type="email"
            disabled
            value={user.email}
            className="mt-1.5 w-full rounded-xl border border-indigo/15 bg-sable-dark/50 px-4 py-3 font-sans text-sm text-ink/50"
          />
          <p className="mt-1 font-sans text-xs text-ink/40">L'email ne peut pas être modifié pour l'instant.</p>
        </div>

        <div>
          <label htmlFor="avatarUrl" className="font-sans text-sm font-semibold text-indigo">
            Photo de profil (URL)
          </label>
          <input
            id="avatarUrl"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1.5 w-full rounded-xl border border-indigo/15 bg-white px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:ring-2 focus:ring-laterite"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-laterite/10 px-4 py-3 font-sans text-sm text-laterite">{error}</p>
        )}
        {success && (
          <p className="rounded-xl bg-benoue/10 px-4 py-3 font-sans text-sm text-benoue-dark">
            Profil mis à jour.
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>

      <button
        onClick={logout}
        className="mt-4 w-full font-sans text-sm font-semibold text-ink/50 hover:text-laterite"
      >
        Se déconnecter
      </button>
    </div>
  );
}