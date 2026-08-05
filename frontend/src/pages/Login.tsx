import { FormEvent, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/services/api';
import { isAxiosError } from 'axios';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (isAxiosError<ApiError>(err) && err.response?.data?.error?.message) {
        setError(err.response.data.error.message);
      } else {
        setError("Impossible de se connecter. Vérifie que l'API est accessible.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-laterite">Bon retour</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-indigo">Se connecter</h1>
      <p className="mt-2 font-sans text-sm text-ink/60">
        Accède à tes favoris et laisse des avis sur tes lieux préférés.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-indigo/15 bg-white px-4 py-3 font-sans text-sm text-ink focus:outline-none focus:ring-2 focus:ring-laterite"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-laterite/10 px-4 py-3 font-sans text-sm text-laterite">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="mt-6 text-center font-sans text-sm text-ink/60">
        Pas encore de compte ?{' '}
        <Link to="/inscription" className="font-semibold text-laterite hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}