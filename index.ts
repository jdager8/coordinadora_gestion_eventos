import App from './src/infraestructure/server.js';
import EnvPlugin from './src/infraestructure/plugins/env.plugin.js';

const app = new App();

async function bootstrap() {
  await app.init({
    [Symbol.for('plugins')]: [EnvPlugin],
    [Symbol.for('routes')]: [],
  });
}

bootstrap();
