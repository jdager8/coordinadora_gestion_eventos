import path from 'path';
import { Pool, PoolClient, QueryResult } from 'pg';
import { DatabaseConfig } from './types';

/**
 * Represents a connection to a PostgreSQL database.
 */
class PostgresDatabase {
  private pool: Pool;

  private static instance: PostgresDatabase;

  private constructor(config: DatabaseConfig) {
    this.pool = new Pool({
      user: config.EM_DB_USER,
      password: config.EM_DB_PASSWORD,
      host: config.EM_DB_HOST,
      port: config.EM_DB_PORT,
      database: config.EM_DB_NAME,
      connectionTimeoutMillis: 1000,
    });
  }

  public static getInstance(config: DatabaseConfig): PostgresDatabase {
    if (!PostgresDatabase.instance) {
      PostgresDatabase.instance = new PostgresDatabase(config);
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
      console.error(`Error executing query: ${error}`);
      throw new Error(`Error executing query`);
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
      throw new Error(`Error executing transaction`);
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async migrate(config: DatabaseConfig): Promise<void> {
    try {
      const postgrator = (await import('postgrator')).default;

      const runner = new postgrator({
        migrationPattern: path.join(__dirname, config.EM_DB_MIGRATIONS_FOLDER),
        driver: config.EM_DB_DRIVER,
        schemaTable: config.EM_DB_MIGRATIONS_TABLE,
        currentSchema: config.EM_DB_SCHEMA,
        execQuery: async (query): Promise<any> => {
          if (query) return await this.executeQuery(query);
        },
      });

      await runner.migrate();
    } catch (error) {
      console.error(`Error migrating database: ${error}`);
      throw new Error(`Error migrating database`);
    }
  }

  async closeConnection(): Promise<void> {
    await this.pool.end();
  }
}

export default PostgresDatabase;
