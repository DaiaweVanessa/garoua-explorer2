import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from '@config/env';
import { apiRouter } from '@presentation/routes';
import { errorHandler } from '@presentation/middlewares/errorHandler';
import openapiSpec from '../docs/openapi.json';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: '100kb' }));
  app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

  // Limite globale ; une limite plus stricte sera ajoutée sur /auth en Phase 1
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 300,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.use('/api/v1', apiRouter);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

  app.use(errorHandler);

  return app;
}
