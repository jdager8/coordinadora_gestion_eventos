import { EventDTO } from '../dto/events.dto';

import { BadRequestException } from '../../application/exceptions/exceptions';

import {
  doesDateFallsWithinRange,
  isValidRange,
} from '../../helpers/date-utils';

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
  validateEventDateRange(throwError: boolean = true): boolean {
    const event = this.event;
    if (!isValidRange({ start: event.startDate, end: event.endDate })) {
      if (throwError) {
        throw new BadRequestException(`Invalid event date range`);
      }
      return false;
    }
    return true;
  }

  //2. Check if schedules are in the event range
  validateSchedules(throwError: boolean = true): boolean {
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
            if (throwError) {
              throw new BadRequestException(
                `Schedule date ${schedule.date} is not in the event range`,
              );
            }
            return false;
          }
        }
      }
    }
    return true;
  }

  //3. Check there is no duplicated schedules dates
  validateDuplicatedSchedules(throwError: boolean = true): boolean {
    const event = this.event;
    if (event.schedule) {
      const dates = event.schedule.map((schedule) => schedule.date);
      if (new Set(dates).size !== dates.length) {
        if (throwError) {
          throw new BadRequestException(`Duplicated schedule dates`);
        }
        return false;
      }
    }
    return true;
  }

  //4. Check if the event has passed
  validateEventNotPassed(throwError: boolean = true): boolean {
    const event = this.event;
    if (new Date(event.endDate) < new Date()) {
      if (throwError) {
        throw new BadRequestException(`The event has already passed`);
      }
      return false;
    }
    return true;
  }

  // 5. Check if the event is happening
  validateEventNotOcurring(throwError: boolean = true): boolean {
    const event = this.event;
    if (new Date(event.startDate) <= new Date()) {
      if (throwError) {
        throw new BadRequestException(`The event is already happening `);
      }
      return false;
    }
    return true;
  }

  // 6. Check if the event has registered users
  validateEventNotRegistered(throwError: boolean = true): boolean {
    const event = this.event;
    if (event.registeredCount > 0) {
      if (throwError) {
        throw new BadRequestException(`The event has already registered users`);
      }
      return false;
    }
    return true;
  }
}

export default EventEntity;
