import path from "path";
import { Pool, PoolClient } from "pg";
import Postgrator from "postgrator";

class PostgresDatabase {
  private pool: Pool;

  constructor() {
    try {
      this.pool = new Pool({
        user: "postgres",
        password: "postgres",
        host: "127.0.0.1",
        port: 5432,
        database: "insurance",
      });
    } catch (error) {
      throw new Error(`Error connecting to database: ${error}`);
    }
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    let client: PoolClient | null = null;

    try {
      client = await this.pool.connect();
      const result = await client.query(query, params);
      return result.rows;
    } catch (error) {
      throw new Error(`Error executing query: ${error}`);
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async executeTransaction(queries: string[]): Promise<void> {
    let client: PoolClient | null = null;

    try {
      client = await this.pool.connect();
      await client.query("BEGIN");

      for (const query of queries) {
        await client.query(query);
      }

      await client.query("COMMIT");
    } catch (error) {
      await client?.query("ROLLBACK");
      throw new Error(`Error executing transaction: ${error}`);
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async migrate(): Promise<void> {
    try {
      const postgrator = new Postgrator({
        migrationPattern: path.join(__dirname, "./migrations/*"),
        driver: "pg",
        database: "your_database_name",
        schemaTable: "migrations",
        currentSchema: "public",
        execQuery: async (query) => {
          return await this.executeQuery(query);
        },
      });

      await postgrator.migrate();
    } catch (error) {
      throw new Error(`Error migrating database: ${error}`);
    }
  }

  async closeConnection(): Promise<void> {
    await this.pool.end();
  }
}

export default PostgresDatabase;
