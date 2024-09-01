import {
  isAfter,
  isEqual,
  isValid,
  isWithinInterval,
  parseISO,
  format,
} from 'date-fns';

interface DateRange {
  start: Date | string;
  end: Date | string;
}

function parseDate(date: string | Date): Date {
  if (typeof date === 'string') {
    const parsedDate = parseISO(date);
    if (!isValid(parsedDate)) {
      throw new Error(
        `Invalid date string: '${date}' could not be parsed as an ISO8601 date.`,
      );
    }
    return parsedDate;
  } else if (date instanceof Date) {
    if (!isValid(date)) {
      throw new Error(
        `Invalid Date object: The date object contains an invalid date.`,
      );
    }
    return date;
  } else {
    throw new Error('Invalid input: Expected a dateString or Date object');
  }
}

function areEquals(leftDate: Date | string, rightDate: Date | string): boolean {
  const parsedDate1 = parseDate(leftDate);
  const parsedDate2 = parseDate(rightDate);
  const date1 = new Date(parsedDate1);
  const date2 = new Date(parsedDate2);
  date1.setUTCHours(0, 0, 0, 0);
  date2.setUTCHours(0, 0, 0, 0);
  return isEqual(date1, date2);
}

function isLaterThan(date: Date | string, comparison: Date | string): boolean {
  const parsedDate = parseDate(date);
  const parsedComparison = parseDate(comparison);
  return isAfter(parsedDate, parsedComparison);
}

function isValidRange(range: DateRange): boolean {
  const parsedStart = parseDate(range.start);
  const parsedEnd = parseDate(range.end);
  return isLaterThan(parsedEnd, parsedStart);
}

function dayName(date: Date): string {
  const parsedDate = parseDate(date);
  return format(parsedDate, 'EEEE');
}

function doesDateFallsWithinRange(
  date: Date | string,
  range: DateRange,
): boolean {
  if (!isValidRange(range)) {
    throw new Error(
      `Invalid date range: The end date must be after the start date. Start: ${range.start}, End: ${range.end}`,
    );
  }
  const parsedDate = parseDate(date);
  const parsedStart = parseDate(range.start);
  const parsedEnd = parseDate(range.end);
  return isWithinInterval(parsedDate, { start: parsedStart, end: parsedEnd });
}

export {
  parseDate,
  isLaterThan,
  isValidRange,
  doesDateFallsWithinRange,
  areEquals,
  dayName,
};
