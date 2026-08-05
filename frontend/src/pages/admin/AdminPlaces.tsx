import { FormEvent, useEffect, useState } from 'react';
import { fetchCategories, fetchPlaces } from '@/services/places';
import {
  addPlacePhoto,
  createPlace,
  deletePlace,
  deletePlacePhoto,
  PlaceInput,
  updatePlace,
  upsertExcursionInfo,
  ExcursionInfoInput,
} from '@/services/admin';
import { fetchExcursionInfo } from '@/services/places';
import { Category, ExcursionInfo, Place } from '@/types';

const emptyPlace: PlaceInput = {
  name: '',
  description: '',
  categoryId: 0,
  latitude: 9.3017,
  longitude: 13.3921,
  address: '',
  phone: '',
  openingHours: '',
};

export default function AdminPlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);

  function reload() {
    setLoading(true);
    Promise.all([fetchPlaces({ limit: 100 }), fetchCategories()])
      .then(([placesRes, cats]) => {
        setPlaces(placesRes.items);
        setCategories(cats);
      })
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce lieu ? Cette action est irréversible.')) return;
    await deletePlace(id);
    reload();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-indigo">Lieux</h1>
        <button
          onClick={() => setEditingId(editingId === 'new' ? null : 'new')}
          className="btn-primary !px-4 !py-2 text-sm"
        >
          {editingId === 'new' ? 'Annuler' : '+ Ajouter un lieu'}
        </button>
      </div>

      {editingId === 'new' && (
        <div className="mt-4">
          <PlaceForm
            categories={categories}
            onCancel={() => setEditingId(null)}
            onSaved={() => {
              setEditingId(null);
              reload();
            }}
          />
        </div>
      )}

      {loading ? (
        <p className="mt-6 font-sans text-sm text-ink/50">Chargement...</p>
      ) : (
        <div className="mt-6 space-y-3">
          {places.length === 0 && (
            <p className="font-sans text-sm text-ink/50">Aucun lieu pour l'instant.</p>
          )}
          {places.map((place) => (
            <div key={place.id} className="card p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wide text-laterite">
                    {place.category.name}
                  </span>
                  <h2 className="font-display text-lg font-semibold text-indigo">{place.name}</h2>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => setEditingId(editingId === place.id ? null : place.id)}
                    className="rounded-full border border-indigo/15 px-4 py-1.5 font-sans text-xs font-semibold text-indigo hover:border-indigo"
                  >
                    {editingId === place.id ? 'Fermer' : 'Modifier'}
                  </button>
                  <button
                    onClick={() => handleDelete(place.id)}
                    className="rounded-full border border-laterite/30 px-4 py-1.5 font-sans text-xs font-semibold text-laterite hover:bg-laterite/10"
                  >
                    Supprimer
                  </button>
                </div>
              </div>

              {editingId === place.id && (
                <div className="mt-4 border-t border-indigo/10 pt-4">
                  <PlaceForm
                    categories={categories}
                    place={place}
                    onCancel={() => setEditingId(null)}
                    onSaved={() => {
                      setEditingId(null);
                      reload();
                    }}
                  />
                  <PhotoManager place={place} onChange={reload} />
                  <ExcursionManager placeId={place.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlaceForm({
  categories,
  place,
  onSaved,
  onCancel,
}: {
  categories: Category[];
  place?: Place;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<PlaceInput>(
    place
      ? {
          name: place.name,
          description: place.description ?? '',
          categoryId: place.categoryId,
          latitude: place.latitude,
          longitude: place.longitude,
          address: place.address ?? '',
          phone: place.phone ?? '',
          openingHours: place.openingHours ?? '',
        }
      : emptyPlace
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.categoryId) {
      setError('Choisis une catégorie.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (place) await updatePlace(place.id, form);
      else await createPlace(form);
      onSaved();
    } catch {
      setError('Impossible d\'enregistrer le lieu.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-3 p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nom">
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Catégorie">
          <select
            required
            value={form.categoryId || ''}
            onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
            className="input"
          >
            <option value="" disabled>
              Choisir...
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description">
        <textarea
          rows={3}
          value={form.description ?? ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input"
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Latitude">
          <input
            type="number"
            step="any"
            required
            value={form.latitude}
            onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })}
            className="input"
          />
        </Field>
        <Field label="Longitude">
          <input
            type="number"
            step="any"
            required
            value={form.longitude}
            onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })}
            className="input"
          />
        </Field>
      </div>

      <Field label="Adresse">
        <input
          value={form.address ?? ''}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="input"
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Téléphone">
          <input
            value={form.phone ?? ''}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input"
          />
        </Field>
        <Field label="Horaires">
          <input
            value={form.openingHours ?? ''}
            onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
            className="input"
            placeholder="ex: Tous les jours 8h-20h"
          />
        </Field>
      </div>

      {error && <p className="font-sans text-sm text-laterite">{error}</p>}

      <div className="flex gap-2">
        <button type="submit" disabled={submitting} className="btn-primary !px-5 !py-2 text-sm disabled:opacity-60">
          {submitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button type="button" onClick={onCancel} className="font-sans text-sm text-ink/50 hover:text-ink">
          Annuler
        </button>
      </div>
    </form>
  );
}

function PhotoManager({ place, onChange }: { place: Place; onChange: () => void }) {
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setSubmitting(true);
    try {
      await addPlacePhoto(place.id, url.trim(), place.photos.length);
      setUrl('');
      onChange();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(photoId: number) {
    await deletePlacePhoto(photoId);
    onChange();
  }

  return (
    <div className="mt-4 border-t border-indigo/10 pt-4">
      <p className="font-sans text-sm font-semibold text-indigo">Photos</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {place.photos.map((photo) => (
          <div key={photo.id} className="group relative h-16 w-16 overflow-hidden rounded-xl">
            <img src={photo.url} alt="" className="h-full w-full object-cover" />
            <button
              onClick={() => handleRemove(photo.id)}
              className="absolute inset-0 hidden items-center justify-center bg-indigo/70 font-sans text-xs font-bold text-sable group-hover:flex"
            >
              Retirer
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleAdd} className="mt-3 flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://... (URL de la photo)"
          className="input flex-1"
        />
        <button type="submit" disabled={submitting} className="btn-secondary !px-4 !py-2 text-sm disabled:opacity-60">
          Ajouter
        </button>
      </form>
    </div>
  );
}

function ExcursionManager({ placeId }: { placeId: number }) {
  const [info, setInfo] = useState<ExcursionInfoInput>({});
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchExcursionInfo(placeId).then((data: ExcursionInfo | null) => {
      if (data) {
        setInfo({
          history: data.history,
          distanceKm: data.distanceKm,
          travelTimeMin: data.travelTimeMin,
          recommendedTransport: data.recommendedTransport,
          estimatedCost: data.estimatedCost,
          practicalTips: data.practicalTips,
          bestPeriod: data.bestPeriod,
        });
      }
      setLoaded(true);
    });
  }, [placeId]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSaved(false);
    try {
      await upsertExcursionInfo(placeId, info);
      setSaved(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (!loaded) return null;

  return (
    <form onSubmit={handleSave} className="mt-4 border-t border-indigo/10 pt-4">
      <p className="font-sans text-sm font-semibold text-indigo">
        Infos excursion <span className="font-normal text-ink/40">(si c'est un site à visiter hors ville)</span>
      </p>

      <div className="mt-2 space-y-3">
        <textarea
          rows={2}
          placeholder="Histoire du lieu"
          value={info.history ?? ''}
          onChange={(e) => setInfo({ ...info, history: e.target.value })}
          className="input"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <input
            type="number"
            step="any"
            placeholder="Distance (km)"
            value={info.distanceKm ?? ''}
            onChange={(e) => setInfo({ ...info, distanceKm: e.target.value ? Number(e.target.value) : null })}
            className="input"
          />
          <input
            type="number"
            placeholder="Trajet (min)"
            value={info.travelTimeMin ?? ''}
            onChange={(e) => setInfo({ ...info, travelTimeMin: e.target.value ? Number(e.target.value) : null })}
            className="input"
          />
          <input
            placeholder="Coût estimé"
            value={info.estimatedCost ?? ''}
            onChange={(e) => setInfo({ ...info, estimatedCost: e.target.value })}
            className="input"
          />
          <input
            placeholder="Transport conseillé"
            value={info.recommendedTransport ?? ''}
            onChange={(e) => setInfo({ ...info, recommendedTransport: e.target.value })}
            className="input"
          />
          <input
            placeholder="Meilleure période"
            value={info.bestPeriod ?? ''}
            onChange={(e) => setInfo({ ...info, bestPeriod: e.target.value })}
            className="input"
          />
        </div>
        <textarea
          rows={2}
          placeholder="Conseils pratiques"
          value={info.practicalTips ?? ''}
          onChange={(e) => setInfo({ ...info, practicalTips: e.target.value })}
          className="input"
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <button type="submit" disabled={submitting} className="btn-secondary !px-4 !py-2 text-sm disabled:opacity-60">
          {submitting ? 'Enregistrement...' : "Enregistrer l'excursion"}
        </button>
        {saved && <span className="font-sans text-xs text-benoue-dark">Enregistré ✓</span>}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-sans text-xs font-semibold uppercase tracking-wide text-indigo/60">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}