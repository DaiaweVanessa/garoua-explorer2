export type TransportType = 'MOTO_TAXI' | 'BUS' | 'AGENCY' | 'CAR_RENTAL' | 'AIRPORT';

export interface TransportOption {
  id: number;
  type: TransportType;
  name: string;
  description: string | null;
  basePrice: number;
  priceUnit: string;
  updatedAt: Date;
}

export interface EventItem {
  id: number;
  title: string;
  description: string | null;
  placeId: number | null;
  startDate: Date;
  endDate: Date;
  createdById: number;
}
