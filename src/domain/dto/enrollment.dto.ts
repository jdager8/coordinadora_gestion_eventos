import { EventDTO } from './events.dto';
import { UserDTO } from './users.dto';

interface EnrollmentDTO {
  id: number;
  eventId?: number;
  event: Partial<EventDTO>;
  userId?: number;
  user: UserDTO;
}

interface CreateEnrollmentDTO
  extends Omit<EnrollmentDTO, 'id' | 'event' | 'user'> {}

interface UpdateEnrollmentDTO extends Partial<EnrollmentDTO> {}

export { EnrollmentDTO, CreateEnrollmentDTO, UpdateEnrollmentDTO };
