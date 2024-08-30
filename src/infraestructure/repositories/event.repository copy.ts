import PostgresDatabase from '../database/postgres/postgres.db';
import { DatabaseConfig } from '../database/postgres/types';

class EventRepository {
  private static instance: EventRepository;
  private db: PostgresDatabase;

  constructor(config: DatabaseConfig) {
    this.db = PostgresDatabase.getInstance(config);
  }

  public static getInstance(config: DatabaseConfig): EventRepository {
    if (!this.instance) {
      this.instance = new EventRepository(config);
    }
    return this.instance;
  }
}
