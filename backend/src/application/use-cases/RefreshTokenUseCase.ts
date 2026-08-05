import { UserRepository } from '@domain/repositories/UserRepository';
import { TokenService } from '@domain/security/ports';
import { AppError } from '@presentation/middlewares/errorHandler';

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(refreshToken: string) {
    let payload;
    try {
      payload = this.tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Refresh token invalide ou expiré');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Utilisateur introuvable');
    }

    const newPayload = { sub: user.id, role: user.role };
    return {
      accessToken: this.tokenService.generateAccessToken(newPayload),
      refreshToken: this.tokenService.generateRefreshToken(newPayload),
    };
  }
}
