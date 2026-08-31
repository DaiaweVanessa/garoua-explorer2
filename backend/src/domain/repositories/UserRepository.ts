import { User } from '@domain/entities/User';

export interface CreateUserInput {
  name: string;
  email: string;
  passwordHash?: string | null;
  googleId?: string | null;
  avatarUrl?: string | null;
}

export interface UpdateUserInput {
  name?: string;
  avatarUrl?: string | null;
  role?: 'ADMIN' | 'MODERATOR' | 'USER';
}

export interface PaginatedUsers {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  findMany(page: number, limit: number): Promise<PaginatedUsers>;
  update(id: number, input: UpdateUserInput): Promise<User>;
  delete(id: number): Promise<void>;
  linkGoogleAccount(id: number, googleId: string): Promise<User>;
}