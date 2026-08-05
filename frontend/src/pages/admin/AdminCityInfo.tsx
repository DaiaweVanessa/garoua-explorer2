import { FormEvent, useEffect, useState } from 'react';
import { fetchCityInfo } from '@/services/content';
import { CityInfoInput, updateCityInfo } from '@/services/admin';

export default function AdminCityInfo() {
  const [form, setForm] = useState<CityInfoInput>({
    history: '',
    culture: '',
    gastronomy: '',
    climate: '',
    districts: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchCityInfo()
      .then((info) => {
        if (info) {
          setForm({
            history: info.history ?? '',
            culture: info.culture ?? '',
            gastronomy: info.gastronomy ?? '',
            climate: info.climate ?? '',
            districts: info.districts ?? '',
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSaved(false);
    try {
      await updateCityInfo(form);
      setSaved(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="font-sans text-sm text-ink/50">Chargement...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-indigo">Contenu Garoua</h1>
      <p className="mt-1 font-sans text-sm text-ink/60">
        Ce texte apparaît sur la page publique "Garoua" — un seul contenu pour tout le site.
      </p>

      <form onSubmit={handleSubmit} className="card mt-4 space-y-4 p-5">
        <TextField label="Histoire" value={form.history} onChange={(v) => setForm({ ...form, history: v })} />
        <TextField label="Culture" value={form.culture} onChange={(v) => setForm({ ...form, culture: v })} />
        <TextField
          label="Gastronomie"
          value={form.gastronomy}
          onChange={(v) => setForm({ ...form, gastronomy: v })}
        />
        <TextField label="Climat" value={form.climate} onChange={(v) => setForm({ ...form, climate: v })} />
        <TextField label="Quartiers" value={form.districts} onChange={(v) => setForm({ ...form, districts: v })} />

        <div className="flex items-center gap-3">
          <button type="submit" disabled={submitting} className="btn-primary !px-5 !py-2 text-sm disabled:opacity-60">
            {submitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          {saved && <span className="font-sans text-xs text-benoue-dark">Enregistré ✓</span>}
        </div>
      </form>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-sans text-xs font-semibold uppercase tracking-wide text-indigo/60">{label}</span>
      <textarea
        rows={4}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="input mt-1"
      />
    </label>
  );
}