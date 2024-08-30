import App from './src/infraestructure/server/server';

import AuthRoutes from './src/adapters/routes/auth.routes';
import EventRoutes from './src/adapters/routes/events.routes';

import SwaggerPlugin from './src/infraestructure/plugins/swagger.plugin';
import EnvPlugin from './src/infraestructure/plugins/env.plugin';
import JwtPlugin from './src/infraestructure/plugins/jwt.plugin';

const app = new App();

async function bootstrap() {
  await app.init({
    [Symbol.for('plugins')]: [EnvPlugin, SwaggerPlugin, JwtPlugin],
    [Symbol.for('routes')]: [AuthRoutes, EventRoutes],
  });
}

bootstrap();
