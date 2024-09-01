import PostgresDatabase from '../database/postgres/postgres.db';

import { CreateEventDTO, EventDTO } from '../../domain/dto/events.dto';
import { UserDTO } from '../../domain/dto/users.dto';

import {
  BadRequestException,
  NotFoundException,
} from '../../application/exceptions/exceptions';

import { DatabaseConfig } from '../database/postgres/types';
import { AttendanceDTO } from '../../domain/dto/attendance.dto';

class AttendanceRepository {
  private static instance: AttendanceRepository;
  private db: PostgresDatabase;

  constructor(config: DatabaseConfig) {
    this.db = PostgresDatabase.getInstance(config);
  }

  public static getInstance(config: DatabaseConfig): AttendanceRepository {
    if (!this.instance) {
      this.instance = new AttendanceRepository(config);
    }
    return this.instance;
  }

  // READ
  async findById(id: number): Promise<AttendanceDTO> {
    const result = await this.db.executeQuery(
      `
        SELECT
          a.id,
          a.id_events_enrollments,
          a.id_events_schedule,
          a.created_by
        FROM
          events_attendance a
        WHERE
          a.id = $1`,
      [id],
    );

    if (result.rowCount !== 1) {
      throw new NotFoundException('Attendance not found');
    } else {
      return result.rows[0];
    }
  }

  async findByEnrollmentAndSchedule(
    enrollmentId: number,
    scheduleId: number,
  ): Promise<AttendanceDTO | null> {
    const result = await this.db.executeQuery(
      `
        SELECT
          a.id,
          a.id_events_enrollments,
          a.id_events_schedule,
          a.created_by
        FROM
          events_attendance a
        WHERE
          a.id_events_enrollments = $1
          AND a.id_events_schedule = $2`,
      [enrollmentId, scheduleId],
    );

    if (result.rowCount !== 1) {
      return null;
    } else {
      return result.rows[0];
    }
  }

  // CREATE
  async create(
    attendace: AttendanceDTO,
    user: UserDTO,
  ): Promise<AttendanceDTO> {
    const result = await this.db.executeQuery(
      `
        INSERT INTO events_attendance (
          id_events_enrollments,
          id_events_schedule,
          created_by
        )
          VALUES ( $1, $2, $3)
        RETURNING id`,
      [attendace.eventEnrollmentId, attendace.eventScheduleId, user.id],
    );

    const newAttendance = await this.findById(result.rows[0].id);

    if (result.rowCount !== 1) {
      throw new BadRequestException('The user could not register attendance');
    } else {
      return newAttendance;
    }
  }

  // COUNTS
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

export default AttendanceRepository;
