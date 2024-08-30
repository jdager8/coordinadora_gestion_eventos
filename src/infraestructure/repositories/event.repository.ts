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

  async findAll(): Promise<EventDTO[]> {
    return [];
  }

  async findById(id: number): Promise<EventDTO> {
    // 1. Find the event by id
    const event = await this.db.executeQuery(
      `SELECT
        *
       FROM
        events e
        JOIN events_types et ON e.id_events_types = et.id
        JOIN users u ON e.created_by = u.id
      WHERE e.id = $1`,
      [id],
    );

    const eventSchedule = await this.db.executeQuery(
      `SELECT
        id,
        date
       FROM
        events_schedule
      WHERE id_events = $1`,
      [id],
    );

    const eventNearPlaces = await this.db.executeQuery(
      `SELECT
        id,
        name,
        address,
        coordinates
       FROM
        events_near_places
      WHERE id_events = $1`,
      [id],
    );

    console.log(event.rows);

    // 2. Return the event
    if (event.rows.length > 0) {
      return {
        id: event.rows[0].id,
        name: event.rows[0].name,
        description: event.rows[0].description,
        location: event.rows[0].location,
        startDate: event.rows[0].start_date,
        endDate: event.rows[0].end_date,
        capacity: event.rows[0].capacity,
        eventType: {
          id: event.rows[0].id_events_types,
          type: event.rows[0].type,
        },
        eventSchedule: eventSchedule.rows.map((row: any) => ({
          id: row.id,
          date: row.date,
        })),
        eventNearPlaces: eventNearPlaces.rows.map((row: any) => ({
          id: row.id,
          name: row.name,
          address: row.address,
          coordinates: {
            latitude: row.coordinates.x,
            longitude: row.coordinates.y,
          },
        })),
        createdBy: event.rows[0].username,
      } as EventDTO;
    }
    throw new NotFoundException('Event not found');
  }
}

export default EventRepository;
