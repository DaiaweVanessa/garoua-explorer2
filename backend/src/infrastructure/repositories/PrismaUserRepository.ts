import { prisma } from '@infrastructure/prisma/client';
import { CreateUserInput, PaginatedUsers, UpdateUserInput, UserRepository } from '@domain/repositories/UserRepository';
import { User } from '@domain/entities/User';

export class PrismaUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(input: CreateUserInput): Promise<User> {
    return prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash ?? null,
        googleId: input.googleId ?? null,
        avatarUrl: input.avatarUrl ?? null,
      },
    });
  }

  async findMany(page: number, limit: number): Promise<PaginatedUsers> {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.user.count(),
    ]);
    return { items, total, page, limit };
  }

  async update(id: number, input: UpdateUserInput): Promise<User> {
    return prisma.user.update({ where: { id }, data: input });
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async linkGoogleAccount(id: number, googleId: string): Promise<User> {
    return prisma.user.update({ where: { id }, data: { googleId } });
  }
}