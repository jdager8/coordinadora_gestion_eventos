import fastify, { FastifyInstance } from 'fastify';

import PostgresDatabase from '../database/postgres/postgres.db';
import { errorHandler } from './error.handler';
import ResponseParserPlugin from './response.handler';
class App {
  public server: FastifyInstance;
  private port: number = 3000;
  private host: string = '0.0.0.0';

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
      ajv: {
        customOptions: {
          allErrors: true,
        },
        plugins: [
          require('ajv-errors'),
          require('@fastify/multipart').ajvFilePlugin,
        ],
      },
    });
  }

  async init(config: { readonly [x: symbol]: any }): Promise<void> {
    try {
      await this.register(config[Symbol.for('plugins')]);
      this.routes(config[Symbol.for('routes')]);
      this.setErrorHandler();
      await this.setResponseHandler();
      this.runMigrations();
      this.listen();
    } catch (error) {
      this.server.log.error(`Error initializing app ${error}`);
      process.exit(1);
    }
  }

  runMigrations(): void {
    try {
      this.server.log.info('Running migrations');
      const db = PostgresDatabase.getInstance(this.server.config);
      db.migrate(this.server.config);
    } catch (error) {
      this.server.log.error(`Error running migrations ${error}`);
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

  async setResponseHandler(): Promise<void> {
    await this.register([ResponseParserPlugin]);
  }

  setErrorHandler(): void {
    this.server.setErrorHandler(errorHandler);
  }

  listen(): void {
    this.server.listen(
      { port: this.port, host: this.host },
      (err, _address) => {
        if (err) {
          this.server.log.error(err);
          process.exit(1);
        }
      },
    );
  }
}

export default App;
