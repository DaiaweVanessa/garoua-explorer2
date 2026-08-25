import { Request, Response, NextFunction } from 'express';
import { JwtTokenService } from '@infrastructure/security/JwtTokenService';
import { AppError } from '@presentation/middlewares/errorHandler';

const tokenService = new JwtTokenService();

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

// Variante non bloquante : attache req.auth si un token valide est présent, sans jamais rejeter
// la requête (utile pour les routes publiques qui se personnalisent si l'utilisateur est connecté)
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const payload = tokenService.verifyAccessToken(header.slice('Bearer '.length));
      req.auth = { userId: payload.sub, role: payload.role };
    } catch {
      // Token absent ou invalide : on continue simplement sans req.auth
    }
  }
  next();
}