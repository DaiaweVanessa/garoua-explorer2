import { UserRepository, UpdateUserInput } from '@domain/repositories/UserRepository';
import { toPublicUser } from '@domain/entities/User';
import { AppError } from '@presentation/middlewares/errorHandler';

export class ListUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(page: number, limit: number) {
    const result = await this.userRepository.findMany(page, limit);
    return { ...result, items: result.items.map(toPublicUser) };
  }
}

export class GetUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Utilisateur introuvable');
    }
    return toPublicUser(user);
  }
}

export interface Requester {
  userId: number;
  role: string;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(targetId: number, input: UpdateUserInput, requester: Requester) {
    const isAdmin = requester.role === 'ADMIN';
    const isSelf = requester.userId === targetId;

    if (!isAdmin && !isSelf) {
      throw new AppError(403, 'FORBIDDEN', "Tu ne peux modifier que ton propre profil");
    }
    // Seul un Admin peut changer un rôle (y compris le sien, en théorie, même si déconseillé)
    if (input.role !== undefined && !isAdmin) {
      throw new AppError(403, 'FORBIDDEN', 'Seul un administrateur peut changer un rôle');
    }

    const existing = await this.userRepository.findById(targetId);
    if (!existing) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Utilisateur introuvable');
    }

    const updated = await this.userRepository.update(targetId, input);
    return toPublicUser(updated);
  }
}

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(targetId: number) {
    const existing = await this.userRepository.findById(targetId);
    if (!existing) {
      throw new AppError(404, 'USER_NOT_FOUND', 'Utilisateur introuvable');
    }
    await this.userRepository.delete(targetId);
  }
}
