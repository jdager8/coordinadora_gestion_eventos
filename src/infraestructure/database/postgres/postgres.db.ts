import path from 'path';
import { Pool, PoolClient, QueryResult } from 'pg';
import { DatabaseConfig } from './types';
import {
  DuplicateException,
  ForeignKeyConstraintException,
} from '../../../application/exceptions/exceptions';

const DATABASE_ERROR = {
  DUPLICATE_KEY: 'The record already exists',
  FOREIGN_KEY_CONSTRAINT: 'The record has associated records',
};

/**
 * Represents a connection to a PostgreSQL database.
 */
class PostgresDatabase {
  private pool: Pool;
  private transaction: PoolClient | null = null;

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
      if (this.transaction) return await this.transaction.query(query, params);
      client = await this.pool.connect();
      return await client.query(query, params);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new DuplicateException(DATABASE_ERROR.DUPLICATE_KEY);
      }
      if (error.code === '23503') {
        throw new ForeignKeyConstraintException(
          DATABASE_ERROR.FOREIGN_KEY_CONSTRAINT,
        );
      }
      console.error(`Error executing query: ${error}`);
      console.error(query);
      throw new Error(`Error executing query`);
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async beginTransaction(): Promise<void> {
    const client = await this.pool.connect();
    await client.query('BEGIN');
    this.transaction = client;
  }

  async commitTransaction(): Promise<void> {
    if (this.transaction) {
      await this.transaction.query('COMMIT');
      this.transaction.release();
      this.transaction = null;
    }
  }

  async rollbackTransaction(): Promise<void> {
    if (this.transaction) {
      await this.transaction.query('ROLLBACK');
      this.transaction.release();
      this.transaction = null;
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
