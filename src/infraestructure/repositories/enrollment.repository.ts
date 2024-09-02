import PostgresDatabase from '../database/postgres/postgres.db';

import {
  CreateEnrollmentDTO,
  EnrollmentDTO,
} from '../../domain/dto/enrollment.dto';

import { BadRequestException } from '../../application/exceptions/exceptions';

import { DatabaseConfig } from '../database/postgres/types';

class EnrollmentRepository {
  private static instance: EnrollmentRepository;
  private db: PostgresDatabase;

  constructor(config: DatabaseConfig) {
    this.db = PostgresDatabase.getInstance(config);
  }

  public static getInstance(config: DatabaseConfig): EnrollmentRepository {
    if (!this.instance) {
      this.instance = new EnrollmentRepository(config);
    }
    return this.instance;
  }

  // READ

  async findAll(): Promise<EnrollmentDTO[]> {
    const result = await this.db.executeQuery(
      `
        SELECT
          json_build_object(
            'id', ee.id,
            'event', json_build_object(
              'id', e.id,
              'name', e.name,
              'description', e.description,
              'location', e.location,
              'address', e.address,
              'coordinates', json_build_object(
                'latitude', e.latitude,
                'longitude', e.longitude
              ),
              'schedule', json_agg(
                json_build_object(
                  'id', es.id,
                  'date', es.date
                )
              ),
              'start_date', e.start_date,
              'end_date', e.end_date
            ),
            'user', json_build_object(
              'id', u.id,
              'username', u.username,
              'person', json_build_object(
                'id', p.id,
                'firstname', p.firstname,
                'lastname', p.lastname,
                'email', p.email,
                'id_number', p.id_number
              )
            )
          ) AS enrollment_data
        FROM
          events_enrollments ee
          LEFT JOIN events e ON ee.id_events = e.id
          LEFT JOIN events_schedule es ON e.id = es.id_events
          LEFT JOIN users u ON ee.id_users = u.id
          LEFT JOIN persons p ON u.id_persons = p.id
        GROUP BY
          ee.id, e.id, u.id, p.id`,
    );

    return result.rows.map((enrollment) => enrollment.enrollment_data);
  }

  async findById(id: number): Promise<EnrollmentDTO | null> {
    const result = await this.db.executeQuery(
      `
        SELECT
          json_build_object(
            'id', ee.id,
            'event', json_build_object(
              'id', e.id,
              'name', e.name,
              'description', e.description,
              'location', e.location,
              'address', e.address,
              'coordinates', json_build_object(
                'latitude', e.latitude,
                'longitude', e.longitude
              ),
              'start_date', e.start_date,
              'end_date', e.end_date
            ),
            'user', json_build_object(
              'id', u.id,
              'username', u.username,
              'person', json_build_object(
                'id', p.id,
                'firstname', p.firstname,
                'lastname', p.lastname,
                'email', p.email,
                'id_number', p.id_number
              )
            )
          ) AS enrollment_data
        FROM
          events_enrollments ee
          LEFT JOIN events e ON ee.id_events = e.id
          LEFT JOIN users u ON ee.id_users = u.id
          LEFT JOIN persons p ON u.id_persons = p.id
        WHERE
          ee.id = $1`,
      [id],
    );

    if (result.rowCount !== 1) {
      return null;
    } else {
      return result.rows[0].enrollment_data;
    }
  }

  async findByUserIdAndEventId(
    idEvent: number,
    idUser: number,
  ): Promise<EnrollmentDTO | null> {
    const result = await this.db.executeQuery(
      `
        SELECT
          json_build_object(
            'id', ee.id,
            'event', json_build_object(
              'id', e.id,
              'name', e.name,
              'description', e.description,
              'location', e.location,
              'address', e.address,
              'coordinates', json_build_object(
                'latitude', e.latitude,
                'longitude', e.longitude
              ),
              'start_date', e.start_date,
              'end_date', e.end_date
            ),
            'user', json_build_object(
              'id', u.id,
              'username', u.username,
              'person', json_build_object(
                'id', p.id,
                'firstname', p.firstname,
                'lastname', p.lastname,
                'email', p.email,
                'id_number', p.id_number
              )
            )
          ) AS enrollment_data
        FROM
          events_enrollments ee
          LEFT JOIN events e ON ee.id_events = e.id
          LEFT JOIN users u ON ee.id_users = u.id
          LEFT JOIN persons p ON u.id_persons = p.id
        WHERE
          e.id = $1 AND u.id = $2
        `,
      [idEvent, idUser],
    );

    if (result.rowCount !== 1) {
      return null;
    } else {
      return result.rows[0].enrollment_data;
    }
  }

  // CREATE
  async create(enrollment: CreateEnrollmentDTO): Promise<any> {
    const result = await this.db.executeQuery(
      `
        INSERT INTO events_enrollments (
          id_events,
          id_users
        ) VALUES ($1, $2) RETURNING id`,
      [enrollment.eventId, enrollment.userId],
    );

    if (result.rowCount !== 1) {
      throw new BadRequestException('The enrollment could not be created');
    } else if (enrollment.eventId && enrollment.userId) {
      return await this.findByUserIdAndEventId(
        enrollment.eventId,
        enrollment.userId,
      );
    }
  }

  // DELETE
  async deletebyUserIdAndEventId(
    eventId: number,
    userID: number,
  ): Promise<void> {
    const result = await this.db.executeQuery(
      `
        DELETE FROM
          events_enrollments
        WHERE
          id_events = $1 AND id_users = $2`,
      [eventId, userID],
    );

    if (result.rows.length !== 0) {
      throw new BadRequestException('The enrollment could not be deleted');
    } else {
      return;
    }
  }
}

export default EnrollmentRepository;
