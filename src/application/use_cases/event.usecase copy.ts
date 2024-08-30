import EventRepository from '../../infraestructure/repositories/event.repository';

class EventUseCase {
  private static instance: EventUseCase;
  private eventRepository: EventRepository;

  constructor(config: any) {
    this.eventRepository = EventRepository.getInstance(config);
  }

  public static getInstance(config: any): EventUseCase {
    if (!this.instance) {
      this.instance = new EventUseCase(config);
    }
    return this.instance;
  }
}

export default EventUseCase;
