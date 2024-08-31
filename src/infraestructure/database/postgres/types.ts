export interface DatabaseConfig {
  EM_DB_HOST: string;
  EM_DB_PORT: number;
  EM_DB_USER: string;
  EM_DB_PASSWORD: string;
  EM_DB_NAME: string;
  EM_DB_DRIVER: 'pg';
  EM_DB_SCHEMA: string;
  EM_DB_MIGRATIONS_TABLE: string;
  EM_DB_MIGRATIONS_FOLDER: string;
}
