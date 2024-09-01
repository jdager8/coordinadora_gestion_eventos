import EnrollmentRepository from '../../infraestructure/repositories/enrollment.repository';
import UserRepository from '../../infraestructure/repositories/user.repository';
import EventRepository from '../../infraestructure/repositories/event.repository';

import {
  CreateEnrollmentDTO,
  EnrollmentDTO,
  UpdateEnrollmentDTO,
} from '../../domain/dto/enrollment.dto';

import {
  BadRequestException,
  NotFoundException,
} from '../exceptions/exceptions';

import { DatabaseConfig } from '../../infraestructure/database/postgres/types';

class EnrollmentUseCase {
  private static instance: EnrollmentUseCase;
  private enrollmentRepository: EnrollmentRepository;
  private userRepository: UserRepository;
  private eventRepository: EventRepository;

  constructor(config: DatabaseConfig) {
    this.enrollmentRepository = EnrollmentRepository.getInstance(config);
    this.eventRepository = EventRepository.getInstance(config);
    this.userRepository = UserRepository.getInstance(config);
  }

  public static getInstance(config: DatabaseConfig): EnrollmentUseCase {
    if (!this.instance) {
      this.instance = new EnrollmentUseCase(config);
    }
    return this.instance;
  }

  async findAll(): Promise<Partial<EnrollmentDTO>[]> {
    return this.enrollmentRepository.findAll();
  }

  async enrollUser(enrollment: CreateEnrollmentDTO): Promise<any> {
    if (!enrollment.userId || !enrollment.eventId) {
      throw new BadRequestException('User ID and Event ID are required');
    }

    const event = await this.eventRepository.findById(enrollment.eventId);
    const user = await this.userRepository.findById(enrollment.userId);

    // 1. Check if event exists
    if (!event) {
      throw new NotFoundException(`Event not found: ${enrollment.eventId}`);
    }

    // 2. Check if user exists
    if (!user) {
      throw new NotFoundException(`User not found: ${enrollment.userId}`);
    }

    // 3. Check if event is full
    if (event.registeredCount >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    // 4. Enroll user
    const enroll = await this.enrollmentRepository.create(enrollment);

    // Update event number of registered users
    await this.eventRepository.updateEventRegistered(enrollment.eventId);
    return enroll;
  }

  async unenrollUser(unenrollment: UpdateEnrollmentDTO): Promise<void> {
    if (!unenrollment.userId || !unenrollment.eventId) {
      throw new BadRequestException('User ID and Event ID are required');
    }

    const event = await this.eventRepository.findById(unenrollment.eventId);
    const user = await this.userRepository.findById(unenrollment.userId);

    // 1. Check if event exists
    if (!event) {
      throw new NotFoundException(`Event not found: ${unenrollment.eventId}`);
    }

    // 2. Check if user exists
    if (!user) {
      throw new NotFoundException(`User not found: ${unenrollment.userId}`);
    }

    // 3. Unenroll user
    const unenrol = this.enrollmentRepository.deletebyUserIdAndEventId(
      unenrollment.eventId,
      unenrollment.userId,
    );

    // Update event number of registered users
    await this.eventRepository.updateEventRegistered(
      unenrollment.eventId,
      false,
    );

    return unenrol;
  }
}

export default EnrollmentUseCase;
