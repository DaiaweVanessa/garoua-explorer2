export interface PlacePhoto {
  id: number;
  placeId: number;
  url: string;
  position: number;
}

export interface Place {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
  latitude: number;
  longitude: number;
  address: string | null;
  phone: string | null;
  openingHours: string | null;
  createdById: number;
  createdAt: Date;
}

export interface PlaceWithRelations extends Place {
  category: { id: number; name: string; slug: string; icon: string | null };
  photos: PlacePhoto[];
  distanceKm?: number; // présent uniquement lors d'une recherche géolocalisée
}
