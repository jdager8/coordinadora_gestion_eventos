import AttendanceRepository from '../../infraestructure/repositories/attendace.repository';

import {
  GetReportByDayNameDTO,
  GetReportByEventsByDayNameDTO,
  GetReportDTO,
} from '../../domain/dto/reports.dto';

import { BadRequestException } from '../exceptions/exceptions';

import { dayName } from '../../helpers/date-utils';

class ReportUseCase {
  private static instance: ReportUseCase;
  private attendanceRepository: AttendanceRepository;

  constructor(config: any) {
    this.attendanceRepository = AttendanceRepository.getInstance(config);
  }

  public static getInstance(config: any): ReportUseCase {
    if (!this.instance) {
      this.instance = new ReportUseCase(config);
    }
    return this.instance;
  }

  async getReport(
    args: GetReportDTO,
  ): Promise<GetReportByDayNameDTO | GetReportByEventsByDayNameDTO[]> {
    switch (args.report) {
      case 'report-by-events-by-day-name': {
        if (!args.params.events) {
          throw new BadRequestException(
            `The event list is required to generate the report: ${args.report}`,
          );
        }
        return this.getReportByEventsByDayName(args.params.events);
      }
      case 'report-by-day-name': {
        if (!args.params.events) {
          throw new BadRequestException(
            `The event list is required to generate the report: ${args.report}`,
          );
        }
        return this.getReportByDayName(args.params.events);
      }
      default: {
        throw new BadRequestException(`Report not found: ${args.report}`);
      }
    }
  }

  async getReportByDayName(events: number[]): Promise<GetReportByDayNameDTO> {
    const data = await this.attendanceRepository.findByEventId(events);

    const report = data.reduce((acc: GetReportByDayNameDTO, item: any) => {
      item.schedule.forEach((date: any) => {
        const day = dayName(date.date);
        acc[day] = (acc[day] || 0) + date.attendance;
      });
      return acc;
    }, {});

    // Add day names without data
    const allDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    allDays.forEach((day: string) => {
      if (!report.hasOwnProperty(day)) {
        report[day] = 0;
      }
    });

    // Order the report by the correct day order
    const orderedReport: GetReportByDayNameDTO = {};
    Object.keys(report)
      .sort((a, b) => allDays.indexOf(a) - allDays.indexOf(b))
      .forEach((key) => {
        orderedReport[key] = report[key];
      });

    return orderedReport;
  }

  async getReportByEventsByDayName(
    events: number[],
  ): Promise<GetReportByEventsByDayNameDTO[]> {
    const data = await this.attendanceRepository.findByEventId(events);

    let allDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const report = data.reduce(
      (acc: GetReportByEventsByDayNameDTO[], item: any) => {
        const attendances = item.schedule.reduce((acc: any, date: any) => {
          const day = dayName(date.date);
          acc[day] = (acc[day] || 0) + date.attendance;
          return acc;
        }, {});

        // Add day names without data
        allDays.forEach((day: string) => {
          if (!attendances.hasOwnProperty(day)) {
            attendances[day] = 0;
          }
        });

        acc.push({
          id: item.id,
          name: item.name,
          startDate: item.startDate,
          endDate: item.endDate,
          location: item.location,
          attendances,
        });

        return acc;
      },
      [],
    );

    // Order the report by the correct day order
    report.forEach((item) => {
      const orderedReport: {
        [key: string]: number;
      } = {};
      Object.keys(item.attendances)
        .sort((a, b) => allDays.indexOf(a) - allDays.indexOf(b))
        .forEach((key) => {
          orderedReport[key] = item.attendances[key];
        });
      item.attendances = orderedReport;
    });

    return report;
  }
}

export default ReportUseCase;
