import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL est requis'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET est requis'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET est requis'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variables d\'environnement invalides :', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

const weakSecretPatterns = ['change_me', 'secret', 'password', '123456'];
function isWeakSecret(secret: string): boolean {
  return secret.length < 16 || weakSecretPatterns.some((p) => secret.toLowerCase().includes(p));
}

if (env.NODE_ENV === 'production') {
  if (isWeakSecret(env.JWT_SECRET) || isWeakSecret(env.JWT_REFRESH_SECRET)) {
    console.error(
      '⚠️  ATTENTION : JWT_SECRET ou JWT_REFRESH_SECRET semble faible ou par défaut en production. ' +
        'Génère des secrets forts (ex: `openssl rand -hex 32`) avant de déployer.'
    );
  }
} else if (isWeakSecret(env.JWT_SECRET) || isWeakSecret(env.JWT_REFRESH_SECRET)) {
  console.warn('⚠️  Secrets JWT faibles détectés (OK en dev, à changer avant la mise en production).');
}
