import { responseSchema } from './base.schema';

const getReport = {
  tags: ['reports'],
  summary: 'Get report',
  description: 'Get report by-day-name or by-event-day-name',
  body: {
    required: ['report'],
    type: 'object',
    properties: {
      report: {
        type: 'string',
        enum: ['report-by-day-name', 'report-by-event-day-name'],
        errorMessage:
          'The type must be report-by-day or report-by-event-day-name',
      },
      params: {
        type: 'object',
        properties: {
          events: {
            type: 'array',
            items: {
              type: 'number',
            },
          },
        },
      },
    },
  },
  response: {
    200: responseSchema(200, false, {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', default: 1 },
          username: { type: 'string', default: 'username' },
          role: {
            type: 'object',
            properties: {
              id: { type: 'number', default: 1 },
              role: { type: 'string', default: 'role' },
            },
          },
          person: {
            type: 'object',
            properties: {
              id: { type: 'number', default: 1 },
              firstname: { type: 'string', default: 'firstname' },
              lastname: { type: 'string', default: 'lastname' },
              email: { type: 'string', default: 'email' },
              idNumber: { type: 'string', default: 'idNumber' },
            },
          },
        },
      },
    }),
    400: responseSchema(400, true),
    403: responseSchema(403, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const reportSchema = {
  report: getReport,
};

export { reportSchema };
