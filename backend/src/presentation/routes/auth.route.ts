import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { PrismaUserRepository } from '@infrastructure/repositories/PrismaUserRepository';
import { BcryptPasswordHasher } from '@infrastructure/security/BcryptPasswordHasher';
import { JwtTokenService } from '@infrastructure/security/JwtTokenService';
import { RegisterUserUseCase } from '@application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from '@application/use-cases/LoginUserUseCase';
import { RefreshTokenUseCase } from '@application/use-cases/RefreshTokenUseCase';
import { LoginWithGoogleUseCase } from '@application/use-cases/LoginWithGoogleUseCase';
import { toPublicUser } from '@domain/entities/User';
import { validateBody } from '@presentation/middlewares/validateBody';
import { authenticate } from '@presentation/middlewares/authenticate';
import { registerSchema, loginSchema, refreshSchema, googleAuthSchema } from '@presentation/validators/auth.validators';
import { AppError } from '@presentation/middlewares/errorHandler';

// Injection manuelle simple (pas de framework DI pour ce projet)
const userRepository = new PrismaUserRepository();
const passwordHasher = new BcryptPasswordHasher();
const tokenService = new JwtTokenService();

const registerUseCase = new RegisterUserUseCase(userRepository, passwordHasher, tokenService);
const loginUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenService);
const refreshUseCase = new RefreshTokenUseCase(userRepository, tokenService);

const googleClientId = process.env.GOOGLE_CLIENT_ID ?? '';
const loginWithGoogleUseCase = new LoginWithGoogleUseCase(userRepository, tokenService, googleClientId);

// Limite stricte sur les routes sensibles pour contrer le brute-force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Trop de tentatives, reessaie plus tard' } },
});

export const authRouter = Router();

authRouter.post('/auth/register', authLimiter, validateBody(registerSchema), async (req, res, next) => {
  try {
    const result = await registerUseCase.execute(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/auth/login', authLimiter, validateBody(loginSchema), async (req, res, next) => {
  try {
    const result = await loginUseCase.execute(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/auth/google', authLimiter, validateBody(googleAuthSchema), async (req, res, next) => {
  try {
    const result = await loginWithGoogleUseCase.execute(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

authRouter.post('/auth/refresh', validateBody(refreshSchema), async (req, res, next) => {
  try {
    const result = await refreshUseCase.execute(req.body.refreshToken);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

// Le logout est gere cote client (suppression des tokens stockes) car les JWT sont stateless ici.
authRouter.post('/auth/logout', authenticate, (_req, res) => {
  res.json({ success: true, data: { message: 'Deconnecte' } });
});

authRouter.get('/auth/me', authenticate, async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.auth!.userId);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Utilisateur introuvable');
    }
    res.json({ success: true, data: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
});