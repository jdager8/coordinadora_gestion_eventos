interface EventDTO {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  registeredCount: number;
}

interface EventTypeDTO {
  id?: number;
  type: string;
}

interface EventScheduleDTO {
  id?: number;
  eventId: number;
  startDate: Date;
  endDate: Date;
}

interface EventNearPlacesDTO {
  id: number;
  eventId: number;
  name: string;
  address: string;
  coordinates: string;
}

interface CreateEventDTO extends Omit<EventDTO, 'id'> {}

interface UpdateEventDTO extends Partial<EventDTO> {}

export {
  EventDTO,
  EventTypeDTO,
  EventScheduleDTO,
  EventNearPlacesDTO,
  CreateEventDTO,
  UpdateEventDTO,
};
