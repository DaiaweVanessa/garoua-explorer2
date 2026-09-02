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

// Serveur de demonstration public OSRM (gratuit, sans cle API, limite raisonnable pour un usage leger)
const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

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

      setRoute({
        coordinates,
        distanceKm: Math.round((leg.distance / 1000) * 10) / 10,
        durationMin: Math.round(leg.duration / 60),
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