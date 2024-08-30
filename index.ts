import App from './src/infraestructure/server';

import AuthRoutes from './src/adapters/routes/auth.routes';
import EventRoutes from './src/adapters/routes/events.routes';

import SwaggerPlugin from './src/infraestructure/plugins/swagger.plugin';
import EnvPlugin from './src/infraestructure/plugins/env.plugin';

const app = new App();

async function bootstrap() {
  await app.init({
    [Symbol.for('plugins')]: [EnvPlugin, SwaggerPlugin],
    [Symbol.for('routes')]: [AuthRoutes, EventRoutes],
  });
}

bootstrap();
