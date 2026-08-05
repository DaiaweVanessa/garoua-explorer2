import { useState } from 'react';
import { addFavorite, removeFavorite } from '@/services/places';

interface FavoriteButtonProps {
  placeId: number;
  initialFavorited: boolean;
  size?: 'sm' | 'md';
  onChange?: (favorited: boolean) => void;
}

export function FavoriteButton({ placeId, initialFavorited, size = 'md', onChange }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, setPending] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault(); // évite de naviguer si le bouton est dans une carte-lien
    e.stopPropagation();
    if (pending) return;

    setPending(true);
    const next = !favorited;
    setFavorited(next); // optimiste
    try {
      if (next) await addFavorite(placeId);
      else await removeFavorite(placeId);
      onChange?.(next);
    } catch {
      setFavorited(!next); // rollback si erreur
    } finally {
      setPending(false);
    }
  }

  const dim = size === 'sm' ? 'h-8 w-8 text-base' : 'h-11 w-11 text-lg';

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      aria-pressed={favorited}
      aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={`grid ${dim} shrink-0 place-items-center rounded-full border transition-colors ${
        favorited
          ? 'border-laterite bg-laterite text-sable-light'
          : 'border-indigo/15 bg-white text-indigo/60 hover:border-laterite hover:text-laterite'
      } disabled:opacity-60`}
    >
      {favorited ? '♥' : '♡'}
    </button>
  );
}