import EventRepository from '../../infraestructure/repositories/event.repository';

import { CreateEventDTO, EventDTO } from '../../domain/entities/dto/events.dto';
import { UserDTO } from '../../domain/entities/dto/users.dto';

import { DatabaseConfig } from '../../infraestructure/database/postgres/types';

class EventUseCase {
  private static instance: EventUseCase;
  private eventRepository: EventRepository;

  constructor(config: any) {
    this.eventRepository = EventRepository.getInstance(config);
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
}

export default EventUseCase;
