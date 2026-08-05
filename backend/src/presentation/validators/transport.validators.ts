import { z } from 'zod';

const transportTypeEnum = z.enum(['MOTO_TAXI', 'BUS', 'AGENCY', 'CAR_RENTAL', 'AIRPORT']);

export const createTransportSchema = z.object({
  type: transportTypeEnum,
  name: z.string().min(2).max(150),
  description: z.string().max(2000).nullable().optional(),
  basePrice: z.coerce.number().min(0),
  priceUnit: z.string().min(1).max(50), // ex: "par trajet", "par jour", "par km"
});

export const updateTransportSchema = z.object({
  type: transportTypeEnum.optional(),
  name: z.string().min(2).max(150).optional(),
  description: z.string().max(2000).nullable().optional(),
  basePrice: z.coerce.number().min(0).optional(),
  priceUnit: z.string().min(1).max(50).optional(),
});
