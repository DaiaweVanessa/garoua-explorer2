import { OAuth2Client } from 'google-auth-library';
import { UserRepository } from '@domain/repositories/UserRepository';
import { TokenService } from '@domain/security/ports';
import { toPublicUser } from '@domain/entities/User';
import { AppError } from '@presentation/middlewares/errorHandler';

export interface LoginWithGoogleInput {
  idToken: string;
}

export class LoginWithGoogleUseCase {
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly googleClientId: string
  ) {
    this.googleClient = new OAuth2Client(googleClientId);
  }

  async execute(input: LoginWithGoogleInput) {
    const payload = await this.verifyGoogleToken(input.idToken);

    if (!payload.email) {
      throw new AppError(400, 'INVALID_GOOGLE_TOKEN', "Le compte Google ne fournit pas d'email");
    }

    let user = await this.userRepository.findByEmail(payload.email);

    if (!user) {
      // Nouvel utilisateur : creation automatique du compte via Google
      user = await this.userRepository.create({
        name: payload.name ?? payload.email.split('@')[0],
        email: payload.email,
        passwordHash: null,
        googleId: payload.sub,
        avatarUrl: payload.picture ?? null,
      });
    } else if (!user.googleId) {
      // Compte existant (cree via email/mdp) : on lie le compte Google
      user = await this.userRepository.linkGoogleAccount(user.id, payload.sub);
    }

    const tokenPayload = { sub: user.id, role: user.role };
    return {
      user: toPublicUser(user),
      accessToken: this.tokenService.generateAccessToken(tokenPayload),
      refreshToken: this.tokenService.generateRefreshToken(tokenPayload),
    };
  }

  private async verifyGoogleToken(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.googleClientId,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new AppError(401, 'INVALID_GOOGLE_TOKEN', 'Token Google invalide');
      }
      return payload;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(401, 'INVALID_GOOGLE_TOKEN', 'Token Google invalide ou expire');
    }
  }
}