import { useEffect, useState } from 'react';
import { deleteUser, fetchUsers, updateUser } from '@/services/admin';
import { User } from '@/types';
import { useAuth } from '@/hooks/useAuth';

const roleLabels: Record<User['role'], string> = {
  ADMIN: 'Admin',
  MODERATOR: 'Moderateur',
  USER: 'Utilisateur',
};

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  function reload() {
    setLoading(true);
    setError(null);
    fetchUsers(page, limit)
      .then((res) => {
        setUsers(res.items);
        setTotal(res.total);
      })
      .catch(() => setError('Impossible de charger les utilisateurs.'))
      .finally(() => setLoading(false));
  }

  useEffect(reload, [page]);

  async function handleRoleChange(userId: number, role: User['role']) {
    try {
      await updateUser(userId, { role });
      reload();
    } catch {
      alert('Impossible de modifier le role.');
    }
  }

  async function handleDelete(userId: number, name: string) {
    if (!confirm(`Supprimer le compte de ${name} ? Cette action est irreversible.`)) return;
    try {
      await deleteUser(userId);
      reload();
    } catch {
      alert('Impossible de supprimer cet utilisateur.');
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-indigo">Utilisateurs</h1>
        <span className="font-mono text-xs text-ink/50">{total} au total</span>
      </div>

      {loading && <p className="mt-6 font-sans text-sm text-ink/50">Chargement...</p>}
      {error && <p className="mt-6 font-sans text-sm text-laterite">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse font-sans text-sm">
            <thead>
              <tr className="border-b border-indigo/10 text-left text-xs uppercase tracking-wide text-ink/40">
                <th className="pb-3 pr-4">Nom</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Connexion</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3 pr-4">Inscrit le</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-indigo/5">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
                      ) : (
                        <div className="grid h-7 w-7 place-items-center rounded-full bg-indigo/10 text-xs font-semibold text-indigo">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-semibold text-indigo">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-ink/70">{u.email}</td>
                  <td className="py-3 pr-4">
                    {u.googleId ? (
                      <span className="rounded-full bg-benoue/10 px-2.5 py-1 font-mono text-[11px] text-benoue-dark">
                        Google
                      </span>
                    ) : (
                      <span className="rounded-full bg-indigo/5 px-2.5 py-1 font-mono text-[11px] text-ink/50">
                        Email
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as User['role'])}
                      disabled={u.id === currentUser?.id}
                      className="rounded-lg border border-indigo/15 bg-white px-2 py-1 text-xs disabled:opacity-50"
                    >
                      {Object.entries(roleLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs text-ink/50">
                    {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="py-3">
                    {u.id !== currentUser?.id && (
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        className="rounded-full border border-laterite/30 px-3 py-1 text-xs font-semibold text-laterite hover:bg-laterite/10"
                      >
                        Supprimer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-full border border-indigo/15 px-3 py-1.5 text-xs font-semibold text-indigo disabled:opacity-40"
              >
                Precedent
              </button>
              <span className="font-mono text-xs text-ink/50">
                Page {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-full border border-indigo/15 px-3 py-1.5 text-xs font-semibold text-indigo disabled:opacity-40"
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}