import { api, ApiResponse } from './api';
import { CityInfo, EventItem, TransportOption } from '@/types';

export async function fetchCityInfo(): Promise<CityInfo | null> {
  const res = await api.get<ApiResponse<CityInfo | null>>('/city-info');
  return res.data.data;
}

export async function fetchTransportOptions(): Promise<TransportOption[]> {
  const res = await api.get<ApiResponse<TransportOption[]>>('/transport');
  return res.data.data;
}

export async function fetchEvents(upcoming = true): Promise<EventItem[]> {
  const res = await api.get<ApiResponse<EventItem[]>>('/events', { params: { upcoming } });
  return res.data.data;
}