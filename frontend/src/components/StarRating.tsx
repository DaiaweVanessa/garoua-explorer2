interface StarRatingProps {
  average: number;
  count: number;
  size?: 'sm' | 'md';
}

export function StarRating({ average, count, size = 'md' }: StarRatingProps) {
  const starSize = size === 'sm' ? 'text-sm' : 'text-lg';

  return (
    <div className="flex items-center gap-2">
      <div className={`flex ${starSize} text-savane-dark`} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n}>{n <= Math.round(average) ? '★' : '☆'}</span>
        ))}
      </div>
      <span className="font-sans text-sm text-ink/70">
        {count > 0 ? (
          <>
            <span className="font-semibold text-ink">{average.toFixed(1)}</span> ({count}{' '}
            avis)
          </>
        ) : (
          'Aucun avis pour le moment'
        )}
      </span>
    </div>
  );
}