import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/services/api';
import { isAxiosError } from 'axios';
import { GoogleLoginButton } from '@/components/GoogleLoginButton';
import { PasswordInput } from '@/components/PasswordInput';

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      if (isAxiosError<ApiError>(err) && err.response?.data?.error?.message) {
        setError(err.response.data.error.message);
      } else {
        setError("Impossible de créer le compte. Vérifie que l'API est accessible.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSuccess(idToken: string) {
    setError(null);
    try {
      await loginWithGoogle(idToken);
      navigate('/', { replace: true });
    } catch {
      setError('Impossible de continuer avec Google. Réessaie.');
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-laterite">Bienvenue</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-indigo">Créer un compte</h1>
      <p className="mt-2 font-sans text-sm text-ink/60">
        Enregistre tes lieux favoris et partage tes avis avec les autres explorateurs.
      </p>

      <div className="mt-8">
        <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={() => setError('Connexion Google annulée ou échouée.')} />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-indigo/10" />
        <span className="font-sans text-xs uppercase tracking-wide text-ink/40">ou</span>
        <div className="h-px flex-1 bg-indigo/10" />
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
            placeholder="Ton nom"
          />
        </div>

        <div>
          <label htmlFor="email" className="font-sans text-sm font-semibold text-indigo">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-indigo/15 bg-white px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:ring-2 focus:ring-laterite"
            placeholder="toi@exemple.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="font-sans text-sm font-semibold text-indigo">
            Mot de passe
          </label>
          <PasswordInput
            id="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-indigo/15 bg-white px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:ring-2 focus:ring-laterite"
            placeholder="8 caractères minimum"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-laterite/10 px-4 py-3 font-sans text-sm text-laterite">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? 'Création...' : 'Créer mon compte'}
        </button>
      </form>

      <p className="mt-6 text-center font-sans text-sm text-ink/60">
        Déjà un compte ?{' '}
        <Link to="/connexion" className="font-semibold text-laterite hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}