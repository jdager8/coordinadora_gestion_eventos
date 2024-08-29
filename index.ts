import App from './src/infraestructure/server';
import EnvPlugin from './src/infraestructure/plugins/env.plugin';
import AuthRoutes from './src/adapters/routes/auth.routes';
import EventRoutes from './src/adapters/routes/events.routes';

const app = new App();

async function bootstrap() {
  await app.init({
    [Symbol.for('plugins')]: [EnvPlugin],
    [Symbol.for('routes')]: [AuthRoutes, EventRoutes],
  });
}

bootstrap();
