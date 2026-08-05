import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Place } from '@/types';

// Correctif nécessaire : les icônes par défaut de Leaflet ne se chargent pas correctement avec Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const GAROUA_CENTER: [number, number] = [9.3017, 13.3921];

interface PlacesMapProps {
  places: Place[];
  center?: [number, number];
  zoom?: number;
}

export function PlacesMap({ places, center, zoom }: PlacesMapProps) {
  const mapCenter: [number, number] =
    center ?? (places.length === 1 ? [places[0].latitude, places[0].longitude] : GAROUA_CENTER);
  const mapZoom = zoom ?? (places.length === 1 ? 15 : 13);

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
    </MapContainer>
  );
}