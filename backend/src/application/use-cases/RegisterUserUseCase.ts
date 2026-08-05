import { UserRepository } from '@domain/repositories/UserRepository';
import { PasswordHasher, TokenService } from '@domain/security/ports';
import { toPublicUser } from '@domain/entities/User';
import { AppError } from '@presentation/middlewares/errorHandler';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService
  ) {}

  async execute(input: RegisterUserInput) {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, 'EMAIL_ALREADY_EXISTS', 'Cet email est déjà utilisé');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    const payload = { sub: user.id, role: user.role };
    return {
      user: toPublicUser(user),
      accessToken: this.tokenService.generateAccessToken(payload),
      refreshToken: this.tokenService.generateRefreshToken(payload),
    };
  }
}
