import { useCallback, useState } from 'react';
import { Coordinates } from './useGeolocation';

export interface RouteResult {
  coordinates: [number, number][];
  distanceKm: number;
  durationMin: number;
}

interface UseRouteResult {
  route: RouteResult | null;
  loading: boolean;
  error: string | null;
  fetchRoute: (from: Coordinates, to: Coordinates) => Promise<void>;
  clearRoute: () => void;
}

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';
const AVERAGE_SPEED_KMH = 70;

export function useRoute(): UseRouteResult {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoute = useCallback(async (from: Coordinates, to: Coordinates) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${OSRM_BASE_URL}/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Reponse invalide du service d\'itineraire');
      const data = await res.json();

      if (data.code !== 'Ok' || !data.routes?.[0]) {
        throw new Error('Aucun itineraire trouve');
      }

      const leg = data.routes[0];
      const coordinates: [number, number][] = leg.geometry.coordinates.map(
        ([lng, lat]: [number, number]) => [lat, lng]
      );

      const distanceKm = Math.round((leg.distance / 1000) * 10) / 10;
      // OSRM sous-estime souvent la vitesse sur les routes camerounaises mal cartographiees.
      // On recalcule une duree plus realiste a partir de la distance reelle (fiable).
      const durationMin = Math.round((distanceKm / AVERAGE_SPEED_KMH) * 60);

      setRoute({
        coordinates,
        distanceKm,
        durationMin,
      });
    } catch {
      setError("Impossible de calculer l'itineraire pour le moment.");
      setRoute(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRoute = useCallback(() => {
    setRoute(null);
    setError(null);
  }, []);

  return { route, loading, error, fetchRoute, clearRoute };
}