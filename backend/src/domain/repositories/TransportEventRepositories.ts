import { TransportOption, TransportType, EventItem } from '@domain/entities/TransportEvent';

export interface CreateTransportInput {
  type: TransportType;
  name: string;
  description?: string | null;
  basePrice: number;
  priceUnit: string;
}

export interface UpdateTransportInput {
  type?: TransportType;
  name?: string;
  description?: string | null;
  basePrice?: number;
  priceUnit?: string;
}

export interface TransportRepository {
  findAll(): Promise<TransportOption[]>;
  findById(id: number): Promise<TransportOption | null>;
  create(input: CreateTransportInput): Promise<TransportOption>;
  update(id: number, input: UpdateTransportInput): Promise<TransportOption>;
  delete(id: number): Promise<void>;
}

export interface EventFilters {
  upcomingOnly?: boolean;
}

export interface CreateEventInput {
  title: string;
  description?: string | null;
  placeId?: number | null;
  startDate: Date;
  endDate: Date;
  createdById: number;
}

export interface UpdateEventInput {
  title?: string;
  description?: string | null;
  placeId?: number | null;
  startDate?: Date;
  endDate?: Date;
}

export interface EventRepository {
  findMany(filters: EventFilters): Promise<EventItem[]>;
  findById(id: number): Promise<EventItem | null>;
  create(input: CreateEventInput): Promise<EventItem>;
  update(id: number, input: UpdateEventInput): Promise<EventItem>;
  delete(id: number): Promise<void>;
}
