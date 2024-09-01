import { de } from 'date-fns/locale';
import { responseSchema } from './base.schema';

const enrollSchema = {
  tags: ['enrollments'],
  body: {
    type: 'object',
    required: ['eventId', 'userId'],
    properties: {
      eventId: {
        type: 'number',
        errorMessage: 'The eventId must be an integer',
      },
      userId: { type: 'number', errorMessage: 'The userId must be an integer' },
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

const unenrollSchema = {
  tags: ['enrollments'],
  query: {
    type: 'object',
    required: ['eventId', 'userId'],
    properties: {
      eventId: {
        type: 'number',
        errorMessage: 'The eventId must be an integer',
      },
      userId: { type: 'number', errorMessage: 'The userId must be an integer' },
    },
  },
  response: {
    204: {
      type: 'string',
      description: 'No content',
    },
    400: responseSchema(400, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const enrollmentSchema = {
  enroll: enrollSchema,
  unenroll: unenrollSchema,
};

export { enrollmentSchema };
