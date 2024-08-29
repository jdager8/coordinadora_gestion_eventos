import fastify, { FastifyInstance } from 'fastify';

import PostgresDatabase from './database/postgres.db.js';
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
    await this.register(config[Symbol.for('plugins')]);
    this.runMigrations();
    this.listen();
  }

  runMigrations(): void {
    try {
      const db = PostgresDatabase.getInstance(this.server.config);
      db.migrate(this.server.config);
    } catch (error) {
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
    await this.server.ready();
  }

  routes(routes: { forEach: (arg0: (routes: any) => void) => void }): void {
    routes.forEach((route) => {
      const router = new route();
      this.server.register(router.router, { prefix: router.prefix_route });
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
