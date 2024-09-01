import { responseSchema } from './base.schema';

const registerAttendanceSchema = {
  tags: ['attendances'],
  body: {
    type: 'object',
    required: ['eventScheduleId', 'eventEnrollmentId'],
    properties: {
      eventScheduleId: {
        type: 'number',
        errorMessage: 'The eventScheduleId must be an integer',
      },
      eventEnrollmentId: {
        type: 'number',
        errorMessage: 'The eventEnrollmentId must be an integer',
      },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'number', default: 1 },
        eventScheduleId: { type: 'number', default: 1 },
        eventEnrollmentId: { type: 'number', default: 1 },
        createdBy: { type: 'string' },
      },
    },
    400: responseSchema(400, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const uploadAttendanceSchema = {
  tags: ['attendances'],
  consumes: ['multipart/form-data'],
  body: {
    type: 'object',
    required: ['template'],
    properties: {
      template: {
        isFile: true,
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        totalSaved: { type: 'number' },
        errors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              lineNumber: { type: 'number' },
              errors: { type: 'array', items: { type: 'string' } },
            },
          },
        },
      },
    },
    400: responseSchema(400, true),
    500: responseSchema(500, true),
  },
};

const attendanceSchema = {
  register: registerAttendanceSchema,
  upload: uploadAttendanceSchema,
};

export { attendanceSchema };
