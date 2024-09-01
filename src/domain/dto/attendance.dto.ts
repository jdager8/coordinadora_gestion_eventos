import { PersonDTO } from './persons.dto';

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

interface CreateAttendanceDTO extends Omit<AttendanceDTO, 'id'> {}

export {
  AttendanceDTO,
  CreateAttendanceDTO,
  UploadAttendaceDTO,
  UploadResponseDTO,
};
