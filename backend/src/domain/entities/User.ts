export type Role = 'ADMIN' | 'MODERATOR' | 'USER';

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  avatarUrl: string | null;
  createdAt: Date;
}

// Vue publique d'un utilisateur : jamais renvoyer passwordHash au client
export type PublicUser = Omit<User, 'passwordHash'>;

export function toPublicUser(user: User): PublicUser {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}
