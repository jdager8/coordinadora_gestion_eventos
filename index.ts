import App from '@/infraestructure/server';

import AuthRoutes from '@/adapters/routes/auth.routes';
import EventRoutes from '@/adapters/routes/events.routes';

import SwaggerPlugin from '@/infraestructure/plugins/swagger.plugin';
import EnvPlugin from '@/infraestructure/plugins/env.plugin';

const app = new App();

async function bootstrap() {
  await app.init({
    [Symbol.for('plugins')]: [EnvPlugin, SwaggerPlugin],
    [Symbol.for('routes')]: [AuthRoutes, EventRoutes],
  });
}

bootstrap();
