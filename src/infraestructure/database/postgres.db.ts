import path from 'path';
import { Pool, PoolClient, QueryResult } from 'pg';

/**
 * Represents a connection to a PostgreSQL database.
 */
class PostgresDatabase {
  private pool: Pool;

  private static instance: PostgresDatabase;

  private constructor() {
    this.pool = new Pool({
      user: 'postgres',
      password: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      database: 'gestion_eventos',
      connectionTimeoutMillis: 1000,
    });
  }

  public static getInstance(): PostgresDatabase {
    if (!PostgresDatabase.instance) {
      PostgresDatabase.instance = new PostgresDatabase();
    }
    return PostgresDatabase.instance;
  }

  async executeQuery(query: string, params: any[] = []): Promise<QueryResult> {
    let client: PoolClient | null = null;

    try {
      client = await this.pool.connect();
      const result = await client.query(query, params);
      return result;
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
      await client.query('BEGIN');

      for (const query of queries) {
        await client.query(query);
      }

      await client.query('COMMIT');
    } catch (error) {
      console.error(`Error executing transaction: ${error}`);
      await client?.query('ROLLBACK');
      throw new Error(`Error executing transaction: ${error}`);
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async migrate(): Promise<void> {
    try {
      const postgrator = (await import('postgrator')).default;

      const runner = new postgrator({
        migrationPattern: path.join(__dirname, './migrations/*'),
        driver: 'pg',
        schemaTable: 'migrations',
        currentSchema: 'public',
        execQuery: async (query): Promise<any> => {
          if (query) return await this.executeQuery(query);
        },
      });

      await runner.migrate();
    } catch (error) {
      throw new Error(`Error migrating database: ${error}`);
    }
  }

  async closeConnection(): Promise<void> {
    await this.pool.end();
  }
}

export default PostgresDatabase;
