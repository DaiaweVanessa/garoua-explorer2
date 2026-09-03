import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { fetchCategories } from '@/services/places';
import { Category } from '@/types';
import { NotificationBell } from '@/components/NotificationBell';

const navLinks = [
  { to: '/excursions', label: 'Excursions' },
  { to: '/garoua', label: 'À propos de la ville' },
  { to: '/transport', label: 'Transport' },
  { to: '/evenements', label: 'Événements' },
];

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const exploreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <div ref={exploreRef} className="relative">
            <button
              onClick={() => setExploreOpen((v) => !v)}
              className="flex items-center gap-1 font-sans text-sm font-semibold text-indigo/70 hover:text-indigo"
              aria-expanded={exploreOpen}
            >
              Explorer
              <span className={`text-xs transition-transform ${exploreOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {exploreOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-2xl border border-indigo/10 bg-white p-2 shadow-[0_12px_32px_rgba(30,42,74,0.15)]">
                <Link
                  to="/lieux"
                  onClick={() => setExploreOpen(false)}
                  className="block rounded-xl px-3 py-2 font-sans text-sm font-semibold text-laterite hover:bg-sable"
                >
                  Toutes les catégories
                </Link>
                <div className="my-1 border-t border-indigo/10" />
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/lieux?category=${c.slug}`}
                    onClick={() => setExploreOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 font-sans text-sm text-indigo hover:bg-sable"
                  >
                    {c.icon && <span aria-hidden>{c.icon}</span>}
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

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

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <NotificationBell />
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

        <div className="flex items-center gap-1 md:hidden">
          {isAuthenticated && <NotificationBell />}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            className="grid h-10 w-10 place-items-center rounded-lg text-indigo"
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
      </div>

      {menuOpen && (
        <div className="border-t border-indigo/10 bg-sable px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col">
            <button
              onClick={() => setMobileExploreOpen((v) => !v)}
              className="flex items-center justify-between rounded-lg px-2 py-3 font-sans text-base font-semibold text-indigo"
              aria-expanded={mobileExploreOpen}
            >
              Explorer
              <span className={`text-sm transition-transform ${mobileExploreOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {mobileExploreOpen && (
              <div className="ml-2 flex flex-col border-l border-indigo/10 pl-3">
                <Link
                  to="/lieux"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-2 py-2 font-sans text-sm font-semibold text-laterite"
                >
                  Toutes les catégories
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/lieux?category=${c.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-2 py-2 font-sans text-sm text-indigo/80"
                  >
                    {c.icon && <span className="mr-1.5">{c.icon}</span>}
                    {c.name}
                  </Link>
                ))}
              </div>
            )}

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