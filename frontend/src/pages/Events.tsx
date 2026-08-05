import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '@/services/content';
import { EventItem } from '@/types';

export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchEvents(!showAll)
      .then(setEvents)
      .finally(() => setLoading(false));
  }, [showAll]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-laterite">Ce qui se passe</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-indigo md:text-4xl">
            Événements
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAll(false)}
            className={`rounded-full px-4 py-2 font-sans text-sm font-semibold transition-colors ${
              !showAll ? 'bg-indigo text-sable' : 'border border-indigo/15 text-indigo/70 hover:text-indigo'
            }`}
          >
            À venir
          </button>
          <button
            onClick={() => setShowAll(true)}
            className={`rounded-full px-4 py-2 font-sans text-sm font-semibold transition-colors ${
              showAll ? 'bg-indigo text-sable' : 'border border-indigo/15 text-indigo/70 hover:text-indigo'
            }`}
          >
            Tous
          </button>
        </div>
      </div>

      {loading && <p className="mt-10 font-sans text-sm text-ink/50">Chargement...</p>}

      {!loading && events.length === 0 && (
        <div className="mt-10 rounded-2xl border border-dashed border-indigo/15 px-6 py-14 text-center">
          <p className="font-sans text-sm text-ink/60">
            {showAll ? "Aucun événement pour l'instant." : 'Aucun événement à venir pour le moment.'}
          </p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {events.map((event) => (
          <div key={event.id} className="card flex gap-4 p-5">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-laterite text-sable">
              <div className="text-center leading-none">
                <div className="font-display text-lg font-bold">
                  {new Date(event.startDate).getDate()}
                </div>
                <div className="font-mono text-[10px] uppercase">
                  {new Date(event.startDate).toLocaleDateString('fr-FR', { month: 'short' })}
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg font-semibold text-indigo">{event.title}</h2>
              <p className="font-mono text-xs text-ink/50">
                {new Date(event.startDate).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
                {event.endDate && event.endDate !== event.startDate && (
                  <>
                    {' '}
                    →{' '}
                    {new Date(event.endDate).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </>
                )}
              </p>
              {event.description && (
                <p className="mt-2 font-sans text-sm text-ink/70">{event.description}</p>
              )}
              {event.placeId && (
                <Link
                  to={`/lieux/${event.placeId}`}
                  className="mt-2 inline-block font-sans text-sm font-semibold text-laterite hover:underline"
                >
                  Voir le lieu →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}