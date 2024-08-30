interface EventDTO {
  id: number;
  name: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  capacity: number;
  registeredCount: number;
  eventType: Partial<EventTypeDTO>;
  eventTypeId?: number;
  eventSchedule: Partial<EventScheduleDTO>[];
  eventNearPlaces: Partial<EventNearPlacesDTO>[];
  createdBy?: number | string;
}

interface EventTypeDTO {
  id?: number;
  type: string;
}

interface EventScheduleDTO {
  id?: number;
  eventId: number;
  date: Date;
}

interface EventNearPlacesDTO {
  id: number;
  eventId: number;
  name: string;
  address: string;
  coordinates: {
    latitude: string;
    longitude: string;
  };
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
