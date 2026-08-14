import { useEffect, useState } from 'react';
import { fetchTransportOptions } from '@/services/content';
import { TransportOption, TransportType } from '@/types';
import { WeatherForecast } from '@/components/WeatherForecast';

const typeLabels: Record<TransportType, { label: string; icon: string }> = {
  MOTO_TAXI: { label: 'Moto-taxi', icon: '🏍️' },
  BUS: { label: 'Bus', icon: '🚌' },
  AGENCY: { label: 'Agence de voyage', icon: '🎫' },
  CAR_RENTAL: { label: 'Location de véhicule', icon: '🚗' },
  AIRPORT: { label: 'Aéroport', icon: '✈️' },
};

export default function Transport() {
  const [options, setOptions] = useState<TransportOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransportOptions()
      .then(setOptions)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-laterite">Se déplacer</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-indigo md:text-4xl">Transport</h1>
      <p className="mt-4 font-sans text-ink/70">
        Les options pour te déplacer à Garoua et dans les environs, avec des prix indicatifs.
      </p>

      <div className="mt-6">
        <WeatherForecast />
      </div>

      {loading && <p className="mt-10 font-sans text-sm text-ink/50">Chargement...</p>}

      {!loading && options.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-indigo/15 px-6 py-14 text-center">
          <p className="font-sans text-sm text-ink/60">
            Aucune option de transport n'est encore renseignée.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {options.map((option) => {
          const meta = typeLabels[option.type];
          return (
            <div key={option.id} className="card flex items-start gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo/5 text-xl">
                {meta.icon}
              </span>
              <div className="flex-1">
                <span className="font-mono text-[11px] uppercase tracking-wide text-laterite">
                  {meta.label}
                </span>
                <h2 className="font-display text-lg font-semibold text-indigo">{option.name}</h2>
                {option.description && (
                  <p className="mt-1 font-sans text-sm text-ink/70">{option.description}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-lg font-semibold text-benoue-dark">
                  {option.basePrice.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="font-sans text-xs text-ink/50">{option.priceUnit}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}