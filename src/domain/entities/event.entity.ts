import { BadRequestException } from '../../application/exceptions/exceptions';
import {
  doesDateFallsWithinRange,
  isValidRange,
} from '../../helpers/date-utils';
import { EventDTO } from '../dto/events.dto';
import { UserDTO } from '../dto/users.dto';

class EventEntity {
  private event: EventDTO;

  constructor(event: EventDTO) {
    this.event = event;
  }

  canBeCreate(): boolean {
    this.validateEventDateRange();
    this.validateSchedules();
    this.validateDuplicatedSchedules();
    return true;
  }

  canBeUpdated(): boolean {
    this.validateEventDateRange();
    this.validateSchedules();
    this.validateDuplicatedSchedules();
    this.validateEventNotPassed();
    this.validateEventNotOcurring();
    return true;
  }

  canBeDeleted(): boolean {
    this.validateEventNotPassed();
    this.validateEventNotRegistered();
    return true;
  }

  //1. Check if is the event has a valid date range
  private validateEventDateRange(): void {
    const event = this.event;
    if (!isValidRange({ start: event.startDate, end: event.endDate })) {
      throw new BadRequestException(`Invalid event date range`);
    }
  }

  //2. Check if schedules are in the event range
  private validateSchedules(): void {
    const event = this.event;
    if (event.schedule) {
      for (const schedule of event.schedule) {
        if (schedule.date && event.startDate && event.endDate) {
          if (
            !doesDateFallsWithinRange(schedule.date, {
              start: event.startDate,
              end: event.endDate,
            })
          ) {
            throw new BadRequestException(
              `Schedule date ${schedule.date} is not in the event range`,
            );
          }
        }
      }
    }
  }

  //3. Check there is no duplicated schedules dates
  private validateDuplicatedSchedules(): void {
    const event = this.event;
    if (event.schedule) {
      const dates = event.schedule.map((schedule) => schedule.date);
      if (new Set(dates).size !== dates.length) {
        throw new BadRequestException(`Duplicated schedule dates`);
      }
    }
  }

  //4. Check if the event has passed
  private validateEventNotPassed(): void {
    const event = this.event;
    if (new Date(event.endDate) < new Date()) {
      throw new BadRequestException(`The event has already passed`);
    }
  }

  // 5. Check if the event is happening
  private validateEventNotOcurring(): void {
    const event = this.event;
    if (new Date(event.startDate) <= new Date()) {
      throw new BadRequestException(`The event is already happening `);
    }
  }

  // 6. Check if the event has registered users
  private validateEventNotRegistered(): void {
    const event = this.event;
    if (event.registeredCount > 0) {
      throw new BadRequestException(`The event has already registered users`);
    }
  }
}

export default EventEntity;
