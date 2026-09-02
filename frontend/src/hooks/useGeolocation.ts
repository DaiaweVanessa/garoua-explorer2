import { useCallback, useState } from 'react';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface UseGeolocationResult {
  position: Coordinates | null;
  loading: boolean;
  error: string | null;
  locate: () => void;
}

export function useGeolocation(): UseGeolocationResult {
  const [position, setPosition] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError("La geolocalisation n'est pas disponible sur cet appareil.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError('Localisation refusee. Autorise-la dans les parametres de ton navigateur.');
        } else if (err.code === err.TIMEOUT) {
          setError('La localisation prend trop de temps. Verifie ton GPS et reessaie.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setError('Position indisponible. Verifie que le GPS est active sur ton telephone.');
        } else {
          setError('Impossible de recuperer ta position pour le moment.');
        }
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  }, []);

  return { position, loading, error, locate };
}