import { z } from 'zod';

export const createPlaceSchema = z.object({
  name: z.string().min(2).max(150),
  description: z.string().max(5000).nullable().optional(),
  categoryId: z.coerce.number().int().positive(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  address: z.string().max(255).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  openingHours: z.string().max(255).nullable().optional(),
  videoUrl: z.string().max(500).nullable().optional(),
});

export const updatePlaceSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  description: z.string().max(5000).nullable().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
  address: z.string().max(255).nullable().optional(),
  phone: z.string().max(30).nullable().optional(),
  openingHours: z.string().max(255).nullable().optional(),
  videoUrl: z.string().max(500).nullable().optional(),
});

export const listPlacesQuerySchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius: z.coerce.number().positive().max(500).optional(),
  excursion: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const addPhotoSchema = z.object({
  url: z.string().url('URL de photo invalide'),
  position: z.coerce.number().int().min(0).default(0),
});