import { EventDTO } from './events.dto';
import { UserDTO } from './users.dto';

interface AttendanceDTO {
  id?: number;
  eventScheduleId?: number;
  eventEnrollmentId?: number;
  createdBy?: string;
}

interface UploadAttendaceDTO {
  eventId: number;
  scheduleDate: string;
  enrollId: number;
  userId: number;
  firstname: string;
  lastname: string;
  email: string;
  idNumber: number;
}

interface UploadResponseDTO {
  total: number;
  totalSaved: number;
  errors: {
    total: number;
    errors: {
      lineNumber: number;
      errors: string[];
    }[];
  };
}

interface FindByEventIdDTO extends Partial<EventDTO> {
  schedule: Array<{
    id: number;
    date: Date;
    attendance: number;
    users: Partial<UserDTO>[];
  }>;
}

interface FindByUserIdAndEventIdAttendanceDTO
  extends Partial<FindByEventIdDTO> {
  user: Partial<UserDTO>[];
}

interface CreateAttendanceDTO extends Omit<AttendanceDTO, 'id'> {}

export {
  AttendanceDTO,
  CreateAttendanceDTO,
  UploadAttendaceDTO,
  UploadResponseDTO,
  FindByEventIdDTO,
  FindByUserIdAndEventIdAttendanceDTO,
};
