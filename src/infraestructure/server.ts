import fastify, { FastifyInstance } from 'fastify';

import PostgresDatabase from './database/postgres/postgres.db';
class App {
  public server: FastifyInstance;
  private port: number = 8080;
  private host: string = 'localhost';

  constructor() {
    this.server = fastify({
      logger: {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss',
            colorize: true,
            ignore: 'pid',
          },
        },
      },
    });
  }

  async init(config: { readonly [x: symbol]: any }): Promise<void> {
    try {
      await this.register(config[Symbol.for('plugins')]);
      this.routes(config[Symbol.for('routes')]);
      this.runMigrations();
      this.listen();
    } catch (error) {
      this.server.log.error('Error initializing app');
      console.error(error);
      process.exit(1);
    }
  }

  runMigrations(): void {
    try {
      this.server.log.info('Running migrations');
      const db = PostgresDatabase.getInstance(this.server.config);
      db.migrate(this.server.config);
    } catch (error) {
      this.server.log.error('Error running migrations');
      console.error(error);
      process.exit(1);
    }
  }

  async register(plugins: {
    forEach: (arg0: (routes: any) => void) => void;
  }): Promise<void> {
    plugins.forEach(async (plugin) => {
      await this.server.register(plugin);
    });
    await this.server.after();
  }

  routes(routes: { forEach: (arg0: (routes: any) => void) => void }): void {
    routes.forEach(async (route) => {
      const router = new route();

      await this.server.register(router.routes, {
        prefix: router.prefix_route,
      });
    });
  }

  listen(): void {
    this.server.listen({ port: this.port }, (err, _address) => {
      if (err) {
        this.server.log.error(err);
        process.exit(1);
      }
    });
  }
}

export default App;
