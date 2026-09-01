import { NavLink, Outlet } from 'react-router-dom';
import { useRequireAdmin } from '@/hooks/useRequireAdmin';

const links = [
  { to: '/admin', label: 'Tableau de bord', icon: '📊' },
  { to: '/admin/lieux', label: 'Lieux', icon: '📍' },
  { to: '/admin/categories', label: 'Catégories', icon: '🏷️' },
  { to: '/admin/garoua', label: 'Contenu Garoua', icon: '📜' },
  { to: '/admin/transport', label: 'Transport', icon: '🏍️' },
  { to: '/admin/evenements', label: 'Événements', icon: '📅' },
  { to: '/admin/utilisateurs', label: 'Utilisateurs', icon: '👤' },
];

export default function AdminLayout() {
  const { ready } = useRequireAdmin();

  if (!ready) return null;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-[200px_1fr]">
      <aside>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-laterite">Admin</p>
        <nav className="mt-4 flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2 font-sans text-sm font-semibold transition-colors ${
                  isActive ? 'bg-indigo text-sable' : 'text-indigo/70 hover:bg-indigo/5'
                }`
              }
            >
              <span aria-hidden>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div>
        <Outlet />
      </div>
    </div>
  );
}