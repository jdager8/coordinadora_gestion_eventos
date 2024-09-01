import EventEntity from '../../domain/entities/event.entity';

import EventRepository from '../../infraestructure/repositories/event.repository';
import AttendanceRepository from '../../infraestructure/repositories/attendace.repository';
import MapBoxAPI from '../../adapters/external/mapbox.api';

import {
  CreateEventDTO,
  EventDTO,
  EventNearPlacesDTO,
  UpdateEventDTO,
  UploadResponseDTO,
} from '../../domain/dto/events.dto';
import { UserDTO } from '../../domain/dto/users.dto';

import {
  BadRequestException,
  NotFoundException,
} from '../exceptions/exceptions';

import { DatabaseConfig } from '../../infraestructure/database/postgres/types';
import FileUtils from '../../helpers/file-utils';
import { parseDate } from '../../helpers/date-utils';

class EventUseCase {
  private static instance: EventUseCase;
  private eventRepository: EventRepository;
  private attendanceRepository: AttendanceRepository;
  private mapBoxAPI: MapBoxAPI;

  constructor(config: DatabaseConfig) {
    this.eventRepository = EventRepository.getInstance(config);
    this.attendanceRepository = AttendanceRepository.getInstance(config);
    this.mapBoxAPI = MapBoxAPI.getInstance(config);
  }

  public static getInstance(config: DatabaseConfig): EventUseCase {
    if (!this.instance) {
      this.instance = new EventUseCase(config);
    }
    return this.instance;
  }

  async findAll(): Promise<EventDTO[]> {
    return this.eventRepository.findAll();
  }

  async findById(id: number): Promise<EventDTO> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event not found: ${id}`);
    }
    return event;
  }

  async searchEvents(q: string): Promise<EventDTO[]> {
    if (!q || q.length < 3) {
      throw new BadRequestException(
        'Query parameter is required and must be at least 3 characters',
      );
    }

    const events = await this.eventRepository.findByName(q);
    // 1. Get coordinates from MapBox API
    for (const event of events) {
      if (!event.coordinates?.latitude && !event.coordinates?.longitude) {
        const coordinates = await this.mapBoxAPI.getCoordinates(
          `${event.location}, ${event.city}`,
        );
        event.coordinates = coordinates;
      }

      // 2. Get events near places
      if (event.coordinates?.latitude && event.coordinates?.longitude) {
        const nearPlaces = await this.mapBoxAPI.getNearPlaces(
          event.coordinates.latitude,
          event.coordinates.longitude,
        );

        event.nearPlaces = [
          ...event.nearPlaces,
          ...(nearPlaces as unknown as EventNearPlacesDTO[]),
        ];
      }
    }

    return events;
  }

  async create(event: CreateEventDTO, currentUser: UserDTO): Promise<EventDTO> {
    const eventEntity = new EventEntity(event);

    // Check is the new event is valid
    if (eventEntity.canBeCreate()) {
      return this.eventRepository.create(event, currentUser);
    } else {
      throw new BadRequestException('Invalid event data');
    }
  }

  async loadEventFromTemplate(
    file: any,
    currentUser: UserDTO,
  ): Promise<UploadResponseDTO> {
    // Validate the data
    if (!file) {
      throw new BadRequestException('Invalid eventa file data');
    }

    // Load the data
    const errors: any[] = [];
    let eventData: any[];

    try {
      eventData = await FileUtils.excelBufferToJSON(file.toBuffer());
      for (const [index, event] of eventData.entries()) {
        const schedule = Object.keys(event).filter((key) =>
          key.includes('day'),
        );

        const eventDto = {
          name: event.name,
          description: event.description,
          location: event.location,
          address: event.address,
          city: event.city,
          startDate: parseDate(event.startDate),
          endDate: parseDate(event.endDate),
          capacity: event.capacity,
          typeId: event.type,
          schedule: schedule.map((key) => ({
            date: parseDate(event[key]),
          })),
          coordinates: {
            latitude: event.latitude,
            longitude: event.longitude,
          },
          createdBy: currentUser.username,
          nearPlaces: [],
        } as unknown as CreateEventDTO;

        const eventEntity = new EventEntity(eventDto as EventDTO);

        const validationErrors: any = {
          lineNumber: index + 1,
          errors: [],
        };

        if (!eventEntity.validateEventDateRange(false)) {
          validationErrors.errors.push(`Invalid event date range`);
        }

        if (!eventEntity.validateSchedules(false)) {
          validationErrors.errors.push(`Invalid event schedules`);
        }

        if (!eventEntity.validateDuplicatedSchedules(false)) {
          validationErrors.errors.push(`Duplicated event schedules`);
        }

        if (validationErrors.errors.length > 0) {
          errors.push(validationErrors);
        } else {
          await this.eventRepository.create(eventDto, currentUser);
        }
      }
    } catch (error) {
      throw new BadRequestException('Invalid event data');
    }

    const result: UploadResponseDTO = {
      total: eventData.length,
      totalSaved: eventData.length - errors.length,
      errors: {
        total: errors.length,
        errors: errors,
      },
    };

    return result;
  }

  async update(
    id: number,
    event: UpdateEventDTO,
    currentUser: UserDTO,
  ): Promise<EventDTO> {
    const eventEntity = new EventEntity(event as EventDTO);
    const eventExists = await this.eventRepository.findById(id);

    // 1. Check if the event exists
    if (!eventExists) {
      throw new NotFoundException(`Event not found: ${id}`);
    }

    // 2. Check if the user is the owner of the event
    if (eventExists.createdBy !== currentUser.username) {
      throw new BadRequestException(
        `You cannot update events from other users`,
      );
    }

    // 3. Check if the new capacity is less than the registered users
    if (event?.capacity && event.capacity < eventExists.registeredCount) {
      throw new BadRequestException(
        `You cannot update the capacity to a value less than the registered users`,
      );
    }

    // 4. Check if deleted schedules have no attendances
    if (event.schedule) {
      for (const schedule of event.schedule) {
        if (schedule.id) {
          const totalAttendances =
            await this.attendanceRepository.countByScheduleId(schedule.id);
          if (totalAttendances > 0) {
            throw new BadRequestException(
              `You cannot delete schedules with attendances`,
            );
          }
        }
      }
    }

    if (eventEntity.canBeUpdated()) {
      // 5. Update the event
      return this.eventRepository.update(id, event);
    } else {
      throw new BadRequestException('Invalid event data');
    }
  }

  async delete(id: number, currentUser: UserDTO): Promise<void> {
    // 1. Check if the event exists
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new NotFoundException(`Event not found: ${id}`);
    }

    const eventEntity = new EventEntity(event);

    //2. Check if the user is the owner of the event
    if (event.createdBy !== currentUser.username) {
      throw new BadRequestException(
        `You cannot delete events from other users`,
      );
    }

    //5. Check if the event has attendances
    const totalAttendances = await this.attendanceRepository.countByEventId(id);
    if (totalAttendances > 0) {
      throw new BadRequestException(
        `You cannot delete events with attendances`,
      );
    }

    if (eventEntity.canBeDeleted()) {
      //6. Delete the event
      return this.eventRepository.delete(id);
    } else {
      throw new BadRequestException('Invalid event data');
    }
  }
}

export default EventUseCase;
