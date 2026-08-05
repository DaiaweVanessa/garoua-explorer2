import { FormEvent, useEffect, useState } from 'react';
import { fetchTransportOptions } from '@/services/content';
import { createTransportOption, deleteTransportOption, TransportInput, updateTransportOption } from '@/services/admin';
import { TransportOption, TransportType } from '@/types';

const typeOptions: { value: TransportType; label: string }[] = [
  { value: 'MOTO_TAXI', label: 'Moto-taxi' },
  { value: 'BUS', label: 'Bus' },
  { value: 'AGENCY', label: 'Agence de voyage' },
  { value: 'CAR_RENTAL', label: 'Location de véhicule' },
  { value: 'AIRPORT', label: 'Aéroport' },
];

const emptyForm: TransportInput = {
  type: 'MOTO_TAXI',
  name: '',
  description: '',
  basePrice: 0,
  priceUnit: 'par trajet',
};

export default function AdminTransport() {
  const [options, setOptions] = useState<TransportOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<TransportInput>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function reload() {
    setLoading(true);
    fetchTransportOptions()
      .then(setOptions)
      .finally(() => setLoading(false));
  }

  useEffect(reload, []);

  function startEdit(opt: TransportOption) {
    setEditingId(opt.id);
    setForm({
      type: opt.type,
      name: opt.name,
      description: opt.description ?? '',
      basePrice: opt.basePrice,
      priceUnit: opt.priceUnit,
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) await updateTransportOption(editingId, form);
      else await createTransportOption(form);
      resetForm();
      reload();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer cette option de transport ?')) return;
    await deleteTransportOption(id);
    reload();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-indigo">Transport</h1>

      <form onSubmit={handleSubmit} className="card mt-4 space-y-3 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as TransportType })}
            className="input"
          >
            {typeOptions.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <input
            required
            placeholder="Nom (ex: Moto-taxi en ville)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
          />
        </div>
        <textarea
          rows={2}
          placeholder="Description"
          value={form.description ?? ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="number"
            step="any"
            required
            placeholder="Prix de base (FCFA)"
            value={form.basePrice || ''}
            onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })}
            className="input"
          />
          <input
            required
            placeholder="Unité (ex: par trajet, par jour)"
            value={form.priceUnit}
            onChange={(e) => setForm({ ...form, priceUnit: e.target.value })}
            className="input"
          />
        </div>
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
          {options.map((opt) => (
            <div key={opt.id} className="card flex items-center justify-between gap-4 p-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wide text-laterite">
                  {typeOptions.find((t) => t.value === opt.type)?.label}
                </span>
                <p className="font-sans text-sm font-semibold text-indigo">{opt.name}</p>
                <p className="font-mono text-xs text-ink/40">
                  {opt.basePrice.toLocaleString('fr-FR')} FCFA · {opt.priceUnit}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => startEdit(opt)}
                  className="rounded-full border border-indigo/15 px-4 py-1.5 font-sans text-xs font-semibold text-indigo hover:border-indigo"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(opt.id)}
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