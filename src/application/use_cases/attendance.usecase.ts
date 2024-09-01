import AttendanceRepository from '../../infraestructure/repositories/attendace.repository';
import EnrollmentRepository from '../../infraestructure/repositories/enrollment.repository';
import EventRepository from '../../infraestructure/repositories/event.repository';
import UserRepository from '../../infraestructure/repositories/user.repository';

import {
  AttendanceDTO,
  CreateAttendanceDTO,
  FindByEventIdDTO,
  FindByUserIdAndEventIdAttendanceDTO,
  UploadResponseDTO,
} from '../../domain/dto/attendance.dto';
import { UserDTO } from '../../domain/dto/users.dto';

import { BadRequestException } from '../exceptions/exceptions';

import FileUtils from '../../helpers/file-utils';
import { areEquals, parseDate } from '../../helpers/date-utils';

import { AttendaceValidationErrors } from '../../domain/interfaces/attendance.interface';
import { DatabaseConfig } from '../../infraestructure/database/postgres/types';

class AttendanceUseCase {
  private static instance: AttendanceUseCase;
  private attendanceRepository: AttendanceRepository;
  private eventRepository: EventRepository;
  private userRepository: UserRepository;
  private enrollmentRepository: EnrollmentRepository;

  constructor(config: DatabaseConfig) {
    this.attendanceRepository = AttendanceRepository.getInstance(config);
    this.eventRepository = EventRepository.getInstance(config);
    this.userRepository = UserRepository.getInstance(config);
    this.enrollmentRepository = EnrollmentRepository.getInstance(config);
  }

  public static getInstance(config: DatabaseConfig): AttendanceUseCase {
    if (!this.instance) {
      this.instance = new AttendanceUseCase(config);
    }
    return this.instance;
  }

  async findByEventId(eventId: number): Promise<FindByEventIdDTO[]> {
    return this.attendanceRepository.findByEventId(eventId);
  }

  async findByUserIdAndEventId(
    eventId: number,
    userId: number,
  ): Promise<FindByUserIdAndEventIdAttendanceDTO[]> {
    return this.attendanceRepository.findByUserIdAndEventId(userId, eventId);
  }

  async registerAttendance(
    attendance: CreateAttendanceDTO,
    currentUser: UserDTO,
  ): Promise<AttendanceDTO> {
    // Validate if is a valid enrollment
    const enrollment = await this.enrollmentRepository.findById(
      attendance.eventEnrollmentId as number,
    );

    if (!enrollment) {
      throw new BadRequestException(
        `Invalid enrollment id ${attendance.eventEnrollmentId}`,
      );
    }

    // Validate if is a valid schedule
    const event = await this.eventRepository.findByScheduleId(
      attendance.eventScheduleId as number,
    );

    if (!event) {
      throw new BadRequestException(
        `Invalid schedule id ${attendance.eventScheduleId}`,
      );
    }

    // Validate if is the user is enrolled in the event
    if (enrollment.eventId !== event.id) {
      throw new BadRequestException(`User is not enrolled in the event`);
    }

    // Validate if the user has already registered attendance
    const attendanceExists =
      await this.attendanceRepository.findByEnrollmentAndSchedule(
        attendance.eventEnrollmentId as number,
        attendance.eventScheduleId as number,
      );
    if (attendanceExists) {
      throw new BadRequestException(
        `User has already registered attendance for this event`,
      );
    }

    return this.attendanceRepository.create(attendance, currentUser);
  }

  async loadAttendanceFromTemplate(
    file: any,
    currentUser: UserDTO,
  ): Promise<UploadResponseDTO> {
    // Validate the data
    if (!file) {
      throw new BadRequestException('No attendance data provided');
    }

    const errors: any[] = [];
    let attendanceData: any[];

    try {
      attendanceData = await FileUtils.excelBufferToJSON(file.toBuffer());
      for (const [index, attendance] of attendanceData.entries()) {
        const { validationErrors, enrollment, matchingSchedule } =
          await this.validateAttendanceData(attendance, index);

        // Check if there are errors otherwise register the attendance
        if (validationErrors.errors.length > 0) {
          errors.push(validationErrors);
        } else {
          const newAttendance: CreateAttendanceDTO = {
            eventEnrollmentId: enrollment?.id,
            eventScheduleId: matchingSchedule?.id,
            createdBy: '',
          };
          await this.attendanceRepository.create(newAttendance, currentUser);
        }
      }
    } catch (error: any) {
      throw new BadRequestException(`Error processing data: ${error.message}`);
    }

    const result: UploadResponseDTO = {
      total: attendanceData.length,
      totalSaved: attendanceData.length - errors.length,
      errors: {
        total: errors.length,
        errors: errors,
      },
    };

    return result;
  }

  private async validateAttendanceData(attendance: any, index: number) {
    const validationErrors: AttendaceValidationErrors = {
      lineNumber: index + 1,
      errors: [],
    };

    const event = await this.eventRepository.findById(attendance.eventId);
    const user = await this.userRepository.findById(attendance.userId);
    const eventSchedule = event?.schedule || [];

    // 1. Validate if the event exists
    if (!event) {
      validationErrors.errors.push(
        `Event with id ${attendance.eventId} not found`,
      );
    }

    // 2. Validate if the user exists
    if (!user) {
      validationErrors.errors.push(
        `User with id ${attendance.userId} not found`,
      );
    }

    // 3. Validate if the event schedule exists
    const matchingSchedule = eventSchedule.find((schedule) => {
      if (!schedule.date) {
        return false;
      } else {
        return areEquals(schedule.date, parseDate(attendance.scheduleDate));
      }
    });

    if (!matchingSchedule) {
      validationErrors.errors.push(
        `Schedule with date ${parseDate(attendance.scheduleDate)} not found`,
      );
    }

    // 4. Validate if the user is enrolled in the event
    const enrollment = await this.enrollmentRepository.findByUserIdAndEventId(
      attendance.eventId,
      attendance.userId,
    );

    if (!enrollment) {
      validationErrors.errors.push(
        `User with id ${attendance.userId} is not enrolled in event with id ${attendance.eventId}`,
      );
    }

    // 5. Validate if the user has already registered attendance
    const attendanceExists =
      await this.attendanceRepository.findByEnrollmentAndSchedule(
        enrollment?.id as number,
        matchingSchedule?.id as number,
      );

    if (attendanceExists) {
      validationErrors.errors.push(
        `User with id ${attendance.userId} has already registered attendance for event with id ${attendance.eventId} on date ${parseDate(attendance.scheduleDate)}`,
      );
    }

    return { validationErrors, enrollment, matchingSchedule };
  }
}

export default AttendanceUseCase;
