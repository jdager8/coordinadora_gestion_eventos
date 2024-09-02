import { responseSchema } from './base.schema';

const getAllSchema = {
  tags: ['enrollments'],
  summary: 'List of enrollments',
  description: 'List of enrollments',
  response: {
    200: responseSchema(200, false, {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', default: 1 },
          event: {
            type: 'object',
            properties: {
              id: { type: 'number', default: 1 },
              name: { type: 'string' },
              description: { type: 'string' },
              location: { type: 'string' },
              address: { type: 'string' },
              coordinates: {
                type: 'object',
                properties: {
                  latitude: { type: 'number' },
                  longitude: { type: 'number' },
                },
              },
              startDate: { type: 'string' },
              endDate: { type: 'string' },
              schedule: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number', default: 1 },
                    date: { type: 'string' },
                  },
                },
              },
            },
          },
          user: {
            type: 'object',
            properties: {
              id: { type: 'number', default: 1 },
              username: { type: 'string' },
              person: {
                type: 'object',
                properties: {
                  id: { type: 'number', default: 1 },
                  firstname: { type: 'string' },
                  lastname: { type: 'string' },
                  email: { type: 'string' },
                  idNumber: { type: 'string' },
                },
              },
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

const enrollSchema = {
  tags: ['enrollments'],
  summary: 'Enroll',
  description: 'Enroll to an event',
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
    201: responseSchema(201, false, {
      type: 'object',
      properties: {
        id: { type: 'number', default: 1 },
        event: {
          type: 'object',
          properties: {
            id: { type: 'number', default: 1 },
            name: { type: 'string' },
            description: { type: 'string' },
            location: { type: 'string' },
            address: { type: 'string' },
            coordinates: {
              type: 'object',
              properties: {
                latitude: { type: 'number' },
                longitude: { type: 'number' },
              },
            },
            startDate: { type: 'string' },
            endDate: { type: 'string' },
          },
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', default: 1 },
            username: { type: 'string' },
            person: {
              type: 'object',
              properties: {
                id: { type: 'number', default: 1 },
                firstname: { type: 'string' },
                lastname: { type: 'string' },
                email: { type: 'string' },
                idNumber: { type: 'string' },
              },
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

const unenrollSchema = {
  tags: ['enrollments'],
  summary: 'Unenroll',
  description: 'Unenroll from an event',
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
    204: responseSchema(204, false, {
      type: 'string',
      description: 'No content',
    }),
    400: responseSchema(400, true),
    403: responseSchema(403, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const enrollmentSchema = {
  getAll: getAllSchema,
  enroll: enrollSchema,
  unenroll: unenrollSchema,
};

export { enrollmentSchema };
