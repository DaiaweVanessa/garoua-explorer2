import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { to: '/lieux', label: 'Explorer' },
  { to: '/garoua', label: 'Garoua' },
  { to: '/transport', label: 'Transport' },
  { to: '/evenements', label: 'Événements' },
];

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-indigo/10 bg-sable/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-indigo">
            Garoua<span className="text-laterite">.</span>Explorer
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `font-sans text-sm font-semibold transition-colors ${
                  isActive ? 'text-laterite' : 'text-indigo/70 hover:text-indigo'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/favoris"
                className="hidden font-sans text-sm font-semibold text-indigo/80 hover:text-indigo sm:block"
              >
                Favoris
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="hidden font-sans text-sm font-semibold text-benoue-dark hover:text-benoue sm:block"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/profil"
                className="hidden font-sans text-sm font-semibold text-indigo hover:text-laterite sm:block"
              >
                {user?.name}
              </Link>
              <button
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="btn-secondary !px-5 !py-2 text-sm"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion" className="hidden font-sans text-sm font-semibold text-indigo/80 hover:text-indigo sm:block">
                Se connecter
              </Link>
              <Link to="/inscription" className="btn-primary !px-5 !py-2 text-sm">
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}