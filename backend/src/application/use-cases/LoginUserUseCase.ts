import { UserRepository } from '@domain/repositories/UserRepository';
import { PasswordHasher, TokenService } from '@domain/security/ports';
import { toPublicUser } from '@domain/entities/User';
import { AppError } from '@presentation/middlewares/errorHandler';

export interface LoginUserInput {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService
  ) {}

  async execute(input: LoginUserInput) {
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Email ou mot de passe incorrect');
    }

    if (!user.passwordHash) {
      throw new AppError(
        401,
        'GOOGLE_ACCOUNT_ONLY',
        'Ce compte utilise la connexion Google. Connecte-toi avec Google.'
      );
    }

    const passwordMatches = await this.passwordHasher.compare(input.password, user.passwordHash);
    if (!passwordMatches) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Email ou mot de passe incorrect');
    }

    const payload = { sub: user.id, role: user.role };
    return {
      user: toPublicUser(user),
      accessToken: this.tokenService.generateAccessToken(payload),
      refreshToken: this.tokenService.generateRefreshToken(payload),
    };
  }
}