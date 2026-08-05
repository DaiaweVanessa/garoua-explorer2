import { FormEvent, useEffect, useState } from 'react';
import { fetchCategories } from '@/services/places';
import { createCategory, deleteCategory, updateCategory } from '@/services/admin';
import { Category } from '@/types';

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reload() {
    setLoading(true);
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  function resetForm() {
    setName('');
    setSlug('');
    setIcon('');
    setEditingId(null);
    setError(null);
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setIcon(cat.icon ?? '');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        await updateCategory(editingId, { name, slug, icon: icon || null });
      } else {
        await createCategory({ name, slug, icon: icon || null });
      }
      resetForm();
      reload();
    } catch {
      setError('Impossible d\'enregistrer la catégorie (le slug est peut-être déjà utilisé).');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer cette catégorie ?')) return;
    await deleteCategory(id);
    reload();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-indigo">Catégories</h1>

      <form onSubmit={handleSubmit} className="card mt-4 space-y-3 p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <input
            required
            placeholder="Nom (ex: Sites touristiques)"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!editingId) setSlug(slugify(e.target.value));
            }}
            className="input"
          />
          <input
            required
            placeholder="slug (ex: sites-touristiques)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="input"
          />
          <input
            placeholder="Icône (emoji, ex: 🏛️)"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="input"
          />
        </div>
        {error && <p className="font-sans text-sm text-laterite">{error}</p>}
        <div className="flex gap-2">
          <button type="submit" disabled={submitting} className="btn-primary !px-5 !py-2 text-sm disabled:opacity-60">
            {editingId ? 'Mettre à jour' : 'Ajouter'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="font-sans text-sm text-ink/50 hover:text-ink">
              Annuler
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="mt-6 font-sans text-sm text-ink/50">Chargement...</p>
      ) : (
        <div className="mt-6 space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="card flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">{cat.icon}</span>
                <div>
                  <p className="font-sans text-sm font-semibold text-indigo">{cat.name}</p>
                  <p className="font-mono text-xs text-ink/40">{cat.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(cat)}
                  className="rounded-full border border-indigo/15 px-4 py-1.5 font-sans text-xs font-semibold text-indigo hover:border-indigo"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="rounded-full border border-laterite/30 px-4 py-1.5 font-sans text-xs font-semibold text-laterite hover:bg-laterite/10"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}