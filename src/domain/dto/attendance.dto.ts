interface AttendanceDTO {
  id: number;
  eventScheduleId?: number;
  eventEnrollmentId?: number;
  createdBy: string;
}

interface CreateAttendanceDTO extends Omit<AttendanceDTO, 'id'> {}

export { AttendanceDTO, CreateAttendanceDTO };
