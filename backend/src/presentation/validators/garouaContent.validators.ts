import { z } from 'zod';

export const upsertExcursionInfoSchema = z.object({
  history: z.string().max(5000).nullable().optional(),
  distanceKm: z.coerce.number().min(0).max(1000).nullable().optional(),
  travelTimeMin: z.coerce.number().int().min(0).nullable().optional(),
  recommendedTransport: z.string().max(255).nullable().optional(),
  estimatedCost: z.string().max(255).nullable().optional(),
  practicalTips: z.string().max(5000).nullable().optional(),
  bestPeriod: z.string().max(255).nullable().optional(),
});

export const upsertCityInfoSchema = z.object({
  history: z.string().max(10000).nullable().optional(),
  culture: z.string().max(10000).nullable().optional(),
  gastronomy: z.string().max(10000).nullable().optional(),
  climate: z.string().max(10000).nullable().optional(),
  districts: z.string().max(10000).nullable().optional(),
});
