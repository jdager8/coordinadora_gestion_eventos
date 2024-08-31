import PostgresDatabase from '../database/postgres/postgres.db';

import { CreateEventDTO, EventDTO } from '../../domain/entities/dto/events.dto';
import { UserDTO } from '../../domain/entities/dto/users.dto';

import {
  BadRequestException,
  NotFoundException,
} from '../../application/exceptions/exceptions';

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
  async findAll(): Promise<EventDTO[]> {
    // 1. Find all events
    const events = await this.db.executeQuery(
      `SELECT
        json_build_object(
          'id', e.id,
          'name', e.name,
          'description', e.description,
          'location', e.location,
          'startDate', e.start_date,
          'endDate', e.end_date,
          'capacity', e.capacity,
          'registeredCount', e.registered_count,
          'eventType', json_build_object(
            'id', et.id,
            'type', et.type
          ),
          'eventSchedule', json_agg(
            json_build_object(
              'id', es.id,
              'date', es.date
            )
          ),
          'eventNearPlace', json_agg(DISTINCT
            jsonb_build_object(
              'id', enp.id,
              'name', enp.name,
              'address', enp.address,
              'coordinates', jsonb_build_object(
                'latitude', enp.coordinates[0],
                'longitude', enp.coordinates[1]
              )
            )
          ),
          'createdBy', u.username
        ) AS event_data
      FROM
        events e
        LEFT JOIN events_types et ON e.id_events_types = et.id
        LEFT JOIN events_schedule es ON e.id = es.id_events
        LEFT JOIN events_near_places enp ON e.id = enp.id_events
        LEFT JOIN users u ON e.created_by = u.id
      GROUP BY
        e.id, et.id, u.username`,
    );

    const eventsData: EventDTO[] = events.rows.map(
      (row: any) => row.event_data,
    );

    return eventsData;
  }

  async findById(id: number): Promise<EventDTO> {
    // 1. Find the event by id
    const event = await this.db.executeQuery(
      `SELECT
        json_build_object(
          'id', e.id,
          'name', e.name,
          'description', e.description,
          'location', e.location,
          'startDate', e.start_date,
          'endDate', e.end_date,
          'capacity', e.capacity,
          'registeredCount', e.registered_count,
          'eventType', json_build_object(
            'id', et.id,
            'type', et.type
          ),
          'eventSchedule', json_agg(
            json_build_object(
              'id', es.id,
              'date', es.date
            )
          ),
          'eventNearPlace', json_agg(DISTINCT
            jsonb_build_object(
              'id', enp.id,
              'name', enp.name,
              'address', enp.address,
              'coordinates', jsonb_build_object(
                'latitude', enp.coordinates[0],
                'longitude', enp.coordinates[1]
              )
            )
          ),
          'createdBy', u.username
        ) AS event_data
      FROM
        events e
        LEFT JOIN events_types et ON e.id_events_types = et.id
        LEFT JOIN events_schedule es ON e.id = es.id_events
        LEFT JOIN events_near_places enp ON e.id = enp.id_events
        LEFT JOIN users u ON e.created_by = u.id
      WHERE e.id = $1
      GROUP BY
        e.id, et.id, u.username`,
      [id],
    );

    // 2. Return the event
    if (event.rows.length === 1) {
      return event.rows[0].event_data as EventDTO;
    }
    throw new NotFoundException('Event not found');
  }

  async findByName(q: string): Promise<EventDTO[]> {
    // 1. Find the event by name
    const events = await this.db.executeQuery(
      `SELECT
        json_build_object(
          'id', e.id,
          'name', e.name,
          'description', e.description,
          'location', e.location,
          'startDate', e.start_date,
          'endDate', e.end_date,
          'capacity', e.capacity,
          'registeredCount', e.registered_count,
          'eventType', json_build_object(
            'id', et.id,
            'type', et.type
          ),
          'eventSchedule', json_agg(
            json_build_object(
              'id', es.id,
              'date', es.date
            )
          ),
          'eventNearPlace', json_agg(DISTINCT
            jsonb_build_object(
              'id', enp.id,
              'name', enp.name,
              'address', enp.address,
              'coordinates', jsonb_build_object(
                'latitude', enp.coordinates[0],
                'longitude', enp.coordinates[1]
              )
            )
          ),
          'createdBy', u.username
        ) AS event_data
      FROM
        events e
        LEFT JOIN events_types et ON e.id_events_types = et.id
        LEFT JOIN events_schedule es ON e.id = es.id_events
        LEFT JOIN events_near_places enp ON e.id = enp.id_events
        LEFT JOIN users u ON e.created_by = u.id
      WHERE e.name ILIKE $1
      GROUP BY
        e.id, et.id, u.username`,
      [`%${q}%`],
    );

    const eventsData: EventDTO[] = events.rows.map(
      (row: any) => row.event_data,
    );

    return eventsData;
  }

  // CREATE
  async create(event: CreateEventDTO, currentUser: UserDTO): Promise<any> {
    this.db.beginTransaction();
    let newEvent: any;
    try {
      // 1. Create a new event
      newEvent = await this.db.executeQuery(
        `INSERT INTO
          events (name, description, location, start_date, end_date, capacity, id_events_types, created_by)
         VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          event.name,
          event.description,
          event.location,
          event.startDate,
          event.endDate,
          event.capacity,
          event.eventTypeId,
          currentUser.id,
        ],
      );

      // 2. Insert event schedules
      for (const schedule of event.eventSchedule) {
        await this.db.executeQuery(
          `INSERT INTO
            events_schedule (id_events, date)
           VALUES
            ($1, $2)`,
          [newEvent.rows[0].id, schedule.date],
        );
      }

      // 3. Insert nearby locations
      if (event.eventNearPlaces && event.eventNearPlaces.length > 0) {
        for (const nearPlace of event.eventNearPlaces) {
          await this.db.executeQuery(
            `INSERT INTO
              events_near_places (name, address, coordinates, id_events)
             VALUES
              ($1, $2, POINT($3, $4), $5)`,
            [
              nearPlace.name,
              nearPlace.address,
              nearPlace.coordinates?.latitude,
              nearPlace.coordinates?.longitude,
              newEvent.rows[0].id,
            ],
          );
        }
      }
      this.db.commitTransaction();
    } catch (error: any) {
      this.db.rollbackTransaction();
      throw new BadRequestException(`Error creating event: ${error.message}`);
    }

    // 4. Return the new event
    return await this.findById(newEvent.rows[0].id);
  }
}

export default EventRepository;
