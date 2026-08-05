import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(2).max(200),
  description: z.string().max(5000).nullable().optional(),
  placeId: z.coerce.number().int().positive().nullable().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const updateEventSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  description: z.string().max(5000).nullable().optional(),
  placeId: z.coerce.number().int().positive().nullable().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const listEventsQuerySchema = z.object({
  upcoming: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
});
