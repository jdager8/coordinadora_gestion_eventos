import { responseSchema } from './base.schema';

const findByEventIdAttendanceSchema = {
  tags: ['attendances'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'number',
        errorMessage: 'The id must be an integer',
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
          name: { type: 'string' },
          description: { type: 'string' },
          location: { type: 'string' },
          address: { type: 'string' },
          coordinates: {
            type: 'object',
            properties: {
              latitude: { type: 'string', default: null, nullable: true },
              longitude: { type: 'string', default: null, nullable: true },
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
                attendance: { type: 'number' },
                users: {
                  type: 'array',
                  items: {
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
            },
          },
        },
      },
    }),
    403: responseSchema(403, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const findByUserIdAndEventIdAttendanceSchema = {
  tags: ['attendances'],
  params: {
    type: 'object',
    required: ['eventId', 'userId'],
    properties: {
      eventId: {
        type: 'number',
        errorMessage: 'The eventId must be an integer',
      },
      userId: {
        type: 'number',
        errorMessage: 'The userId must be an integer',
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
          type: {
            type: 'object',
            properties: {
              id: { type: 'number', default: 1 },
              type: { type: 'string' },
            },
          },
          schedule: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', default: 1 },
                date: { type: 'string' },
                attendance: { type: 'number' },
              },
            },
          },
          user: {
            type: 'object',
            items: {
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
      },
    }),
    403: responseSchema(403, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const templateAttendanceSchema = {
  tags: ['attendances'],
  response: {
    200: responseSchema(200, false, {
      content: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
    403: responseSchema(403, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

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
    201: responseSchema(201, false, {
      type: 'object',
      properties: {
        id: { type: 'number', default: 1 },
        eventScheduleId: { type: 'number', default: 1 },
        eventEnrollmentId: { type: 'number', default: 1 },
        createdBy: { type: 'string' },
      },
    }),
    400: responseSchema(400, true),
    403: responseSchema(403, true),
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
    200: responseSchema(200, false, {
      type: 'object',
      properties: {
        total: { type: 'number' },
        totalSaved: { type: 'number' },
        errors: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  lineNumber: { type: 'number' },
                  errors: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    }),
    400: responseSchema(400, true),
    403: responseSchema(403, true),
    500: responseSchema(500, true),
  },
};

const attendanceSchema = {
  findByEventId: findByEventIdAttendanceSchema,
  findByUserIdAndEventId: findByUserIdAndEventIdAttendanceSchema,
  template: templateAttendanceSchema,
  register: registerAttendanceSchema,
  upload: uploadAttendanceSchema,
};

export { attendanceSchema };
