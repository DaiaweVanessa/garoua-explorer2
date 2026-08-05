import { z } from 'zod';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().regex(slugRegex, 'Le slug doit être en minuscules avec des tirets (ex: sites-touristiques)'),
  icon: z.string().max(100).nullable().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z.string().regex(slugRegex).optional(),
  icon: z.string().max(100).nullable().optional(),
});
