import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './errorHandler';

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ');
      return next(new AppError(400, 'VALIDATION_ERROR', message));
    }
    (req as any).validatedQuery = result.data;
    next();
  };
}
