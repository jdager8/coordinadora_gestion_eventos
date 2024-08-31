import AttendanceRepository from '../../infraestructure/repositories/attendace.repository';

import { AttendanceDTO } from '../../domain/dto/attendance.dto';
import { UserDTO } from '../../domain/dto/users.dto';

class AttendanceUseCase {
  private static instance: AttendanceUseCase;
  private attendanceRepository: AttendanceRepository;

  constructor(config: any) {
    this.attendanceRepository = AttendanceRepository.getInstance(config);
  }

  public static getInstance(config: any): AttendanceUseCase {
    if (!this.instance) {
      this.instance = new AttendanceUseCase(config);
    }
    return this.instance;
  }

  async registerAttendance(
    attendace: AttendanceDTO,
    currentUser: UserDTO,
  ): Promise<AttendanceDTO> {
    return this.attendanceRepository.create(attendace, currentUser);
  }
}

export default AttendanceUseCase;
