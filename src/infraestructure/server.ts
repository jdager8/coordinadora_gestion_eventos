import fastify, { FastifyInstance } from 'fastify';

import PostgresDatabase from './database/postgres.db.js';
class App {
  public server: FastifyInstance;
  private port: number = 8080;
  private host: string = 'localhost';

  constructor() {
    this.server = fastify();
    this.runMigrations();
  }

  runMigrations(): void {
    try {
      const db = PostgresDatabase.getInstance();
      db.migrate();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  register(plugins: { forEach: (arg0: (routes: any) => void) => void }): void {
    plugins.forEach((plugin) => {
      this.server.register(plugin);
    });
  }

  routes(routes: { forEach: (arg0: (routes: any) => void) => void }): void {
    routes.forEach((route) => {
      const router = new route();
      this.server.register(router.router, { prefix: router.prefix_route });
    });
  }

  listen(): void {
    console.log(`Server running at http://${this.host}:${this.port}`);
    this.server.listen({ port: this.port }, (err, _address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  }
}

export default App;
