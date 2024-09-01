import PostgresDatabase from '../database/postgres/postgres.db';

import { UserDTO } from '../../domain/dto/users.dto';
import {
  AttendanceDTO,
  CreateAttendanceDTO,
  FindByEventIdDTO,
  FindByUserIdAndEventIdAttendanceDTO,
} from '../../domain/dto/attendance.dto';

import {
  BadRequestException,
  NotFoundException,
} from '../../application/exceptions/exceptions';

import { DatabaseConfig } from '../database/postgres/types';

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
  async findByEventId(eventId: number | number[]): Promise<FindByEventIdDTO[]> {
    const result = await this.db.executeQuery(
      `
        SELECT
          json_build_object(
            'id', e.id,
            'name', e.name,
            'description', e.description,
            'location', e.location,
            'address', e.address,
            'coordinates', json_build_object(
              'latitude', e.latitude,
              'longitude', e.longitude
            ),
            'startDate', e.start_date,
            'endDate', e.end_date,
            'type', json_build_object(
              'id', et.id,
              'type', et.type
            ),
            'schedule', (
              SELECT json_agg( json_build_object(
                'id', es.id,
                'date', es.date,
                'attendance', (
                  SELECT count(*)
                  FROM events_attendance a
                  WHERE a.id_events_schedule = es.id
                ),
                'users', (
                  SELECT json_agg(
                    json_build_object(
                      'id', u.id,
                      'username', u.username,
                      'person', json_build_object(
                        'id', p.id,
                        'firstname', p.firstname,
                        'lastname', p.lastname,
                        'email', p.email,
                        'idNumber', p.id_number
                      )
                    )
                  )
                  FROM
                    events_attendance a
                    LEFT JOIN events_enrollments ee ON a.id_events_enrollments = ee.id
                    LEFT JOIN users u ON ee.id_users = u.id
                    LEFT JOIN persons p ON u.id_persons = p.id
                  WHERE
                    a.id_events_schedule = es.id
                )
              ))
            )
          ) AS attendance_data
        FROM
          events e
          LEFT JOIN events_schedule es ON e.id = es.id_events
          LEFT JOIN events_types et ON e.id_events_types = et.id
        WHERE
          e.id = ANY($1)
        GROUP BY
          e.id, et.id`,
      [Array.isArray(eventId) ? eventId : [eventId]],
    );

    const attendanceData: FindByEventIdDTO[] = result.rows.map(
      (row: any) => row.attendance_data,
    );

    return attendanceData;
  }

  async findByUserIdAndEventId(
    userId: number,
    eventId: number,
  ): Promise<FindByUserIdAndEventIdAttendanceDTO[]> {
    const result = await this.db.executeQuery(
      `
        SELECT
          json_build_object(
            'id', e.id,
            'name', e.name,
            'description', e.description,
            'location', e.location,
            'address', e.address,
            'coordinates', json_build_object(
              'latitude', e.latitude,
              'longitude', e.longitude
            ),
            'startDate', e.start_date,
            'endDate', e.end_date,
            'type', json_build_object(
              'id', et.id,
              'type', et.type
            ),
            'schedule', json_agg(
              json_build_object(
                'id', es.id,
                'date', es.date,
                'attendance', (
                  SELECT count(*)
                  FROM events_attendance a
                  WHERE a.id_events_schedule = es.id
                )
              )
            ),
            'user', json_build_object(
              'id', u.id,
              'username', u.username,
              'person', json_build_object(
                'id', p.id,
                'firstname', p.firstname,
                'lastname', p.lastname,
                'email', p.email,
                'idNumber', p.id_number
              )
            )
          ) AS attendance_data
        FROM
          events e
          LEFT JOIN events_schedule es ON e.id = es.id_events
          LEFT JOIN events_attendance a ON es.id = a.id_events_schedule
          LEFT JOIN events_enrollments ee ON a.id_events_enrollments = ee.id
          LEFT JOIN events_types et ON e.id_events_types = et.id
          LEFT JOIN users u ON ee.id_users = u.id
          LEFT JOIN persons p ON u.id_persons = p.id
        WHERE
          u.id = $1
          AND e.id = $2
        GROUP BY
          e.id, et.id, u.id, p.id`,
      [userId, eventId],
    );

    const attendanceData: FindByUserIdAndEventIdAttendanceDTO[] =
      result.rows.map((row: any) => row.attendance_data);

    console.log(attendanceData);

    return attendanceData;
  }

  // Only for internal use
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

  // Only for internal use
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
    attendace: CreateAttendanceDTO,
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
