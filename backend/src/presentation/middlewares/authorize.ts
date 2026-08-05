import { NextFunction, Request, Response } from 'express';
import { AppError } from './errorHandler';

export function authorize(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      return next(new AppError(401, 'UNAUTHENTICATED', 'Authentification requise'));
    }
    if (!allowedRoles.includes(req.auth.role)) {
      return next(new AppError(403, 'FORBIDDEN', 'Accès refusé pour ce rôle'));
    }
    next();
  };
}
