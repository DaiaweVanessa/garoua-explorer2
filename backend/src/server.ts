import { env } from '@config/env';
import { createApp } from './app';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`Garoua Explorer API démarrée sur http://localhost:${env.PORT}`);
  console.log(`Health check : http://localhost:${env.PORT}/api/v1/health`);
  console.log(`Documentation Swagger : http://localhost:${env.PORT}/api-docs`);
});
