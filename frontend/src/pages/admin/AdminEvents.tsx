import { FormEvent, useEffect, useState } from 'react';
import { fetchEvents } from '@/services/content';
import { createEvent, deleteEvent, EventInput, updateEvent } from '@/services/admin';
import { fetchPlaces } from '@/services/places';
import { EventItem, Place } from '@/types';

const emptyForm: EventInput = {
  title: '',
  description: '',
  placeId: null,
  startDate: '',
  endDate: '',
};

function toDateInput(iso: string) {
  return iso ? iso.slice(0, 10) : '';
}

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<EventInput>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    setLoading(true);
    Promise.all([fetchEvents(false), fetchPlaces({ limit: 100 })])
      .then(([evs, placesRes]) => {
        setEvents(evs);
        setPlaces(placesRes.items);
      })
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  function startEdit(ev: EventItem) {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      description: ev.description ?? '',
      placeId: ev.placeId,
      startDate: toDateInput(ev.startDate),
      endDate: toDateInput(ev.endDate),
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) await updateEvent(editingId, form);
      else await createEvent(form);
      resetForm();
      reload();
    } catch {
      setError("Impossible d'enregistrer l'événement (vérifie les dates).");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer cet événement ?')) return;
    await deleteEvent(id);
    reload();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-indigo">Événements</h1>

      <form onSubmit={handleSubmit} className="card mt-4 space-y-3 p-5">
        <input
          required
          placeholder="Titre"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input"
        />
        <textarea
          rows={2}
          placeholder="Description"
          value={form.description ?? ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input"
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="font-sans text-xs font-semibold uppercase tracking-wide text-indigo/60">Début</span>
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="input mt-1"
            />
          </label>
          <label className="block">
            <span className="font-sans text-xs font-semibold uppercase tracking-wide text-indigo/60">Fin</span>
            <input
              type="date"
              required
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="input mt-1"
            />
          </label>
          <label className="block">
            <span className="font-sans text-xs font-semibold uppercase tracking-wide text-indigo/60">
              Lieu (optionnel)
            </span>
            <select
              value={form.placeId ?? ''}
              onChange={(e) => setForm({ ...form, placeId: e.target.value ? Number(e.target.value) : null })}
              className="input mt-1"
            >
              <option value="">Aucun</option>
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
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
          {events.map((ev) => (
            <div key={ev.id} className="card flex items-center justify-between gap-4 p-4">
              <div>
                <p className="font-sans text-sm font-semibold text-indigo">{ev.title}</p>
                <p className="font-mono text-xs text-ink/40">
                  {new Date(ev.startDate).toLocaleDateString('fr-FR')} →{' '}
                  {new Date(ev.endDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => startEdit(ev)}
                  className="rounded-full border border-indigo/15 px-4 py-1.5 font-sans text-xs font-semibold text-indigo hover:border-indigo"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(ev.id)}
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