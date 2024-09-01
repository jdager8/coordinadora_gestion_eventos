interface GetReportDTO {
  report: string;
  params: {
    events?: number[];
  };
}

interface GetReportByDayNameDTO {
  [key: string]: number;
}

interface GetReportByEventsByDayNameDTO {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  attendances: {
    [key: string]: number;
  };
}

export { GetReportDTO, GetReportByDayNameDTO, GetReportByEventsByDayNameDTO };
