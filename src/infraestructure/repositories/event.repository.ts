import PostgresDatabase from '../database/postgres/postgres.db';

import {
  CreateEventDTO,
  EventDTO,
  UpdateEventDTO,
} from '../../domain/dto/events.dto';
import { UserDTO } from '../../domain/dto/users.dto';

import { BadRequestException } from '../../application/exceptions/exceptions';

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
          'address', e.address,
          'city', e.city,
          'coordinates', jsonb_build_object(
            'latitude', e.latitude,
            'longitude', e.longitude
          ),
          'startDate', e.start_date,
          'endDate', e.end_date,
          'capacity', e.capacity,
          'registeredCount', e.registered_count,
          'eventType', json_build_object(
            'id', et.id,
            'type', et.type
          ),
          'schedule', json_agg(
            json_build_object(
              'id', es.id,
              'date', es.date
            )
          ),
          'nearPlaces', json_agg(DISTINCT
            jsonb_build_object(
              'id', enp.id,
              'name', enp.name,
              'address', enp.address,
              'coordinates', jsonb_build_object(
                'latitude', enp.latitude,
                'longitude', enp.longitude
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

  async findById(id: number): Promise<EventDTO | null> {
    // 1. Find the event by id
    const event = await this.db.executeQuery(
      `SELECT
        json_build_object(
          'id', e.id,
          'name', e.name,
          'description', e.description,
          'location', e.location,
          'address', e.address,
          'city', e.city,
          'coordinates', jsonb_build_object(
            'latitude', e.latitude,
            'longitude', e.longitude
          ),
          'startDate', e.start_date,
          'endDate', e.end_date,
          'capacity', e.capacity,
          'registeredCount', e.registered_count,
          'eventType', json_build_object(
            'id', et.id,
            'type', et.type
          ),
          'schedule', json_agg(
            json_build_object(
              'id', es.id,
              'date', es.date
            )
          ),
          'nearPlaces', json_agg(DISTINCT
            jsonb_build_object(
              'id', enp.id,
              'name', enp.name,
              'address', enp.address,
              'coordinates', jsonb_build_object(
                'latitude', enp.latitude,
                'longitude', enp.longitude
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
    return null;
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
          'address', e.address,
          'city', e.city,
          'coordinates', jsonb_build_object(
            'latitude', e.latitude,
            'longitude', e.longitude
          ),
          'startDate', e.start_date,
          'endDate', e.end_date,
          'capacity', e.capacity,
          'registeredCount', e.registered_count,
          'eventType', json_build_object(
            'id', et.id,
            'type', et.type
          ),
          'schedule', json_agg(
            json_build_object(
              'id', es.id,
              'date', es.date
            )
          ),
          'nearPlaces', json_agg(DISTINCT
            jsonb_build_object(
              'id', enp.id,
              'name', enp.name,
              'address', enp.address,
              'coordinates', jsonb_build_object(
                'latitude', enp.latitude,
                'longitude', enp.longitude
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

  async findByScheduleId(scheduleId: number): Promise<EventDTO | null> {
    // 1. Find the event by schedule id
    const event = await this.db.executeQuery(
      `SELECT
        json_build_object(
          'id', e.id,
          'name', e.name,
          'description', e.description,
          'location', e.location,
          'address', e.address,
          'city', e.city,
          'coordinates', jsonb_build_object(
            'latitude', e.latitude,
            'longitude', e.longitude
          ),
          'startDate', e.start_date,
          'endDate', e.end_date,
          'capacity', e.capacity,
          'registeredCount', e.registered_count,
          'eventType', json_build_object(
            'id', et.id,
            'type', et.type
          ),
          'schedule', json_agg(
            json_build_object(
              'id', es.id,
              'date', es.date
            )
          ),
          'nearPlaces', json_agg(DISTINCT
            jsonb_build_object(
              'id', enp.id,
              'name', enp.name,
              'address', enp.address,
              'coordinates', jsonb_build_object(
                'latitude', enp.latitude,
                'longitude', enp.longitude
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
      WHERE es.id = $1
      GROUP BY
        e.id, et.id, u.username`,
      [scheduleId],
    );

    // 2. Return the event
    if (event.rows.length === 1) {
      return event.rows[0].event_data as EventDTO;
    }
    return null;
  }

  // CREATE
  async create(event: CreateEventDTO, currentUser: UserDTO): Promise<any> {
    this.db.beginTransaction();
    let newEvent: any;
    try {
      // 1. Create a new event
      newEvent = await this.db.executeQuery(
        `INSERT INTO
          events (name, description, location, address, city, latitude, longitude, start_date, end_date, capacity, id_events_types, created_by)
         VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id`,
        [
          event.name,
          event.description,
          event.location,
          event.address,
          event.city,
          event.coordinates?.latitude,
          event.coordinates?.longitude,
          event.startDate,
          event.endDate,
          event.capacity,
          event.typeId,
          currentUser.id,
        ],
      );

      // 2. Insert event schedules
      for (const schedule of event.schedule) {
        await this.db.executeQuery(
          `INSERT INTO
            events_schedule (id_events, date)
           VALUES
            ($1, $2)`,
          [newEvent.rows[0].id, schedule.date],
        );
      }

      // 3. Insert nearby locations
      if (event.nearPlaces && event.nearPlaces.length > 0) {
        for (const nearPlace of event.nearPlaces) {
          await this.db.executeQuery(
            `INSERT INTO
              events_near_places (name, address, latitude, longitude, id_events)
             VALUES
              ($1, $2, $3, $4, $5)`,
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

  // UPDATE
  async update(id: number, event: UpdateEventDTO): Promise<any> {
    this.db.beginTransaction();
    try {
      // 1. Update the event
      await this.db.executeQuery(
        `UPDATE events
         SET
          name = COALESCE($1, name),
          description = COALESCE($2, description),
          location = COALESCE($3, location),
          address = COALESCE($4, address),
          city = COALESCE($5, city),
          latitude = COALESCE($6, latitude),
          longitude = COALESCE($7, longitude),
          start_date = COALESCE($8, start_date),
          end_date = COALESCE($9, end_date),
          capacity = COALESCE($10, capacity),
          id_events_types = COALESCE($11, id_events_types)
         WHERE id = $12
         RETURNING id`,
        [
          event.name,
          event.description,
          event.location,
          event.address,
          event.city,
          event.coordinates?.latitude,
          event.coordinates?.longitude,
          event.startDate,
          event.endDate,
          event.capacity,
          event.typeId,
          id,
        ],
      );

      // 2. Insert/Update event schedules, insert new schedules, update existing schedules, and delete removed schedules
      if (event.schedule && event.schedule.length > 0) {
        for (const schedule of event.schedule) {
          // INSERT AND UPDATE ON CONFLICT
          await this.db.executeQuery(
            `INSERT INTO
              events_schedule (id_events, date)
             VALUES
              ($1, $2)
             ON CONFLICT (id_events, date)
             DO UPDATE SET
              date = $2`,
            [id, schedule.date],
          );
        }

        // DELETE REMOVED SCHEDULES
        await this.db.executeQuery(
          `DELETE FROM events_schedule
           WHERE id_events = $1
           AND date NOT IN (${event.schedule.map((s, i) => `$${i + 2}`).join(',')})`,
          [id, ...event.schedule.map((s) => s.date)],
        );
      }

      // 3. Insert/Update nearby locations, insert new locations, update existing locations, and delete removed locations
      if (event.nearPlaces && event.nearPlaces.length > 0) {
        for (const nearPlace of event.nearPlaces) {
          // INSERT AND UPDATE ON CONFLICT
          await this.db.executeQuery(
            `INSERT INTO
              events_near_places (name, address, latitude, longitude, id_events)
             VALUES
              ($1, $2, $3, $4, $5)
             ON CONFLICT (name, address, id_events)
             DO UPDATE SET
              address = $2,
              latitude = $3,
              longitude = $4`,
            [
              nearPlace.name,
              nearPlace.address,
              nearPlace.coordinates?.latitude,
              nearPlace.coordinates?.longitude,
              id,
            ],
          );
        }

        // DELETE REMOVED LOCATIONS
        await this.db.executeQuery(
          `DELETE FROM events_near_places
           WHERE id_events = $1
           AND name NOT IN (${event.nearPlaces.map((np, i) => `$${i + 2}`).join(',')})`,
          [id, ...event.nearPlaces.map((np) => np.name)],
        );
      }

      this.db.commitTransaction();
    } catch (error: any) {
      this.db.rollbackTransaction();
      throw new BadRequestException(`Error updating event: ${error.message}`);
    }

    // 4. Return the updated event
    return await this.findById(id);
  }

  async updateEventRegistered(
    id: number,
    add: boolean = true,
  ): Promise<boolean> {
    // 1. Update the event registered count if add is true, otherwise decrease it
    const result = await this.db.executeQuery(
      `UPDATE events
       SET
        registered_count = registered_count ${add ? '+' : '-'} 1
       WHERE id = $1`,
      [id],
    );

    // 2. Return the updated event
    if (result.rowCount === 1) {
      return true;
    } else {
      throw new BadRequestException('The event could not be updated');
    }
  }

  // DELETE
  async delete(id: number): Promise<void> {
    // 1. Delete the event
    const result = await this.db.executeQuery(
      'DELETE FROM events WHERE id = $1',
      [id],
    );

    if (result.rows.length !== 0) {
      throw new BadRequestException('The event could not be deleted');
    } else {
      return;
    }
  }
}

export default EventRepository;
