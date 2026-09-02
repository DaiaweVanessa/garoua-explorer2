import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import { Place } from '@/types';
// Correctif necessaire : les icones par defaut de Leaflet ne se chargent pas correctement avec Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const userIcon = new L.DivIcon({
  className: '',
  html: '<div style="width:16px;height:16px;border-radius:9999px;background:#2563eb;border:3px solid white;box-shadow:0 0 0 2px rgba(37,99,235,0.4)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const GAROUA_CENTER: [number, number] = [9.3017, 13.3921];

interface PlacesMapProps {
  places: Place[];
  center?: [number, number];
  zoom?: number;
  userPosition?: [number, number] | null;
  routeCoordinates?: [number, number][] | null;
  fitToRoute?: boolean;
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length < 2) return;
    const bounds = L.latLngBounds(points.map(([lat, lng]) => L.latLng(lat, lng)));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [points, map]);
  return null;
}

export function PlacesMap({
  places,
  center,
  zoom,
  userPosition,
  routeCoordinates,
  fitToRoute,
}: PlacesMapProps) {
  const mapCenter: [number, number] =
    center ?? (places.length === 1 ? [places[0].latitude, places[0].longitude] : GAROUA_CENTER);
  const mapZoom = zoom ?? (places.length === 1 ? 15 : 13);

  const shouldFitRoute = Boolean(fitToRoute && routeCoordinates && routeCoordinates.length > 1);

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      scrollWheelZoom={false}
      className="h-full w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {places.map((place) => (
        <Marker key={place.id} position={[place.latitude, place.longitude]}>
          <Popup>
            <p className="font-sans font-semibold text-indigo">{place.name}</p>
            <p className="text-xs text-ink/60">{place.category.name}</p>
          </Popup>
        </Marker>
      ))}

      {userPosition && (
        <Marker position={userPosition} icon={userIcon}>
          <Popup>
            <p className="font-sans text-xs font-semibold text-indigo">Ta position</p>
          </Popup>
        </Marker>
      )}

      {routeCoordinates && routeCoordinates.length > 1 && (
        <Polyline positions={routeCoordinates} pathOptions={{ color: '#c2410c', weight: 4, opacity: 0.85 }} />
      )}

      {shouldFitRoute && routeCoordinates && <FitBounds points={routeCoordinates} />}
    </MapContainer>
  );
}