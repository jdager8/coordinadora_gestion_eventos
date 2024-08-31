import { responseSchema } from './base.schema';

const registerAttendanceSchema = {
  tags: ['attendances'],
  body: {
    type: 'object',
    required: ['eventId', 'enrollmentId'],
    properties: {
      eventId: {
        type: 'number',
        errorMessage: 'The eventId must be an integer',
      },
      enrollmentId: {
        type: 'number',
        errorMessage: 'The enrollmentId must be an integer',
      },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: {
        id: { type: 'number', default: 1 },
        eventId: { type: 'number', default: 1 },
        enrollmentId: { type: 'number', default: 1 },
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
    200: responseSchema(200, false),
    400: responseSchema(400, true),
    500: responseSchema(500, true),
  },
};

const attendanceSchema = {
  register: registerAttendanceSchema,
  upload: uploadAttendanceSchema,
};

export { attendanceSchema };
