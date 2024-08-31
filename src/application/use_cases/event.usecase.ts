import EventRepository from '../../infraestructure/repositories/event.repository';

import {
  CreateEventDTO,
  EventDTO,
  EventNearPlacesDTO,
} from '../../domain/entities/dto/events.dto';
import { UserDTO } from '../../domain/entities/dto/users.dto';

import { DatabaseConfig } from '../../infraestructure/database/postgres/types';
import MapBoxAPI from '../../adapters/external/mapbox.api';

class EventUseCase {
  private static instance: EventUseCase;
  private eventRepository: EventRepository;
  private mapBoxAPI: MapBoxAPI;

  constructor(config: any) {
    this.eventRepository = EventRepository.getInstance(config);
    this.mapBoxAPI = MapBoxAPI.getInstance(config);
  }

  public static getInstance(config: DatabaseConfig): EventUseCase {
    if (!this.instance) {
      this.instance = new EventUseCase(config);
    }
    return this.instance;
  }

  async create(event: CreateEventDTO, currentUser: UserDTO): Promise<EventDTO> {
    return this.eventRepository.create(event, currentUser);
  }

  async findAll(): Promise<EventDTO[]> {
    return this.eventRepository.findAll();
  }

  async findById(id: number): Promise<EventDTO> {
    return this.eventRepository.findById(id);
  }

  async searchEvents(q: string): Promise<EventDTO[]> {
    const events = await this.eventRepository.findByName(q);
    // 1. Get coordinates from MapBox API
    for (const event of events) {
      if (!event.coordinates?.latitude && !event.coordinates?.longitude) {
        const coordinates = await this.mapBoxAPI.getCoordinates(
          `${event.location}, ${event.city}`,
        );
        event.coordinates = coordinates;
      }
    }

    // 2. Get events near places
    for (const event of events) {
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
}

export default EventUseCase;
