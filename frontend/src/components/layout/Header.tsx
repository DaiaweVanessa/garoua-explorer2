import { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate('/');
  }

  return (
    <header className="sticky top-0 z-40 border-b border-indigo/10 bg-sable/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4">
        <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-indigo sm:text-2xl">
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

        {/* Actions desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/favoris" className="font-sans text-sm font-semibold text-indigo/80 hover:text-indigo">
                Favoris
              </Link>
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="font-sans text-sm font-semibold text-benoue-dark hover:text-benoue">
                  Admin
                </Link>
              )}
              <Link to="/profil" className="font-sans text-sm font-semibold text-indigo hover:text-laterite">
                {user?.name}
              </Link>
              <button onClick={handleLogout} className="btn-secondary !px-5 !py-2 text-sm">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/connexion" className="font-sans text-sm font-semibold text-indigo/80 hover:text-indigo">
                Se connecter
              </Link>
              <Link to="/inscription" className="btn-primary !px-5 !py-2 text-sm">
                Créer un compte
              </Link>
            </>
          )}
        </div>

        {/* Bouton hamburger mobile */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          className="grid h-10 w-10 place-items-center rounded-lg text-indigo md:hidden"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`h-0.5 w-5 bg-current transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span className={`h-0.5 w-5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
            <span
              className={`h-0.5 w-5 bg-current transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </div>
        </button>
      </div>

      {/* Panneau mobile */}
      {menuOpen && (
        <div className="border-t border-indigo/10 bg-sable px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-2 py-3 font-sans text-base font-semibold ${
                    isActive ? 'text-laterite' : 'text-indigo'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-2 flex flex-col border-t border-indigo/10 pt-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/favoris"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-3 font-sans text-base font-semibold text-indigo"
                >
                  Favoris
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-2 py-3 font-sans text-base font-semibold text-benoue-dark"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/profil"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-3 font-sans text-base font-semibold text-indigo"
                >
                  {user?.name} — Profil
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary mt-3 w-full !py-3 text-sm"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/connexion"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-3 font-sans text-base font-semibold text-indigo"
                >
                  Se connecter
                </Link>
                <Link
                  to="/inscription"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary mt-2 w-full !py-3 text-sm"
                >
                  Créer un compte
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}