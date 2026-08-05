import { NextFunction, Request, Response } from 'express';
import { JwtTokenService } from '@infrastructure/security/JwtTokenService';
import { AppError } from './errorHandler';

const tokenService = new JwtTokenService();

// Étend le type Request d'Express pour porter l'utilisateur authentifié
declare global {
  namespace Express {
    interface Request {
      auth?: { userId: number; role: string };
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError(401, 'UNAUTHENTICATED', 'Token d\'authentification manquant'));
  }

  const token = header.slice('Bearer '.length);
  try {
    const payload = tokenService.verifyAccessToken(token);
    req.auth = { userId: payload.sub, role: payload.role };
    next();
  } catch {
    next(new AppError(401, 'UNAUTHENTICATED', 'Token invalide ou expiré'));
  }
}
