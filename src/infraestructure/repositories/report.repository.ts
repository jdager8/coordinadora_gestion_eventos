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

  // READ
  async countByEventId(eventId: number): Promise<number> {
    const result = await this.db.executeQuery(
      `
        SELECT
          count(*) as count
        FROM
          events_attendance a
          LEFT JOIN events_enrollments ee ON a.id_events_enrollments = ee.id
          LEFT JOIN events e ON ee.id_events = e.id
        WHERE
          e.id = $1`,
      [eventId],
    );

    return result.rows[0].count;
  }

  async countByScheduleId(scheduleId: number): Promise<number> {
    const result = await this.db.executeQuery(
      `
        SELECT
          count(*) as count
        FROM
          events_attendance a
          LEFT JOIN events_schedule es ON a.id_events_schedule = es.id
        WHERE
          es.id = $1`,
      [scheduleId],
    );

    return result.rows[0].count;
  }
}

export default EventRepository;
