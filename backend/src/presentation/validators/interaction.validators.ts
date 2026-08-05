import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Le commentaire ne peut pas être vide').max(2000),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(2000),
});

export const listCommentsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export const createRatingSchema = z.object({
  stars: z.coerce.number().int().min(1, 'La note doit être entre 1 et 5').max(5),
});
