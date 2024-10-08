import { responseSchema } from './base.schema';

const createEventSchema = {
  tags: ['events'],
  summary: 'Create event',
  description: 'Create a new event',
  body: {
    type: 'object',
    required: [
      'name',
      'description',
      'location',
      'address',
      'city',
      'capacity',
      'startDate',
      'endDate',
      'typeId',
      'schedule',
    ],
    properties: {
      name: {
        type: 'string',
        errorMessage: 'Name must be a string',
      },
      description: {
        type: 'string',
        errorMessage: 'Description must be a string',
      },
      location: {
        type: 'string',
        errorMessage: 'Location must be a string',
      },
      address: {
        type: 'string',
        errorMessage: 'Address must be a string',
      },
      city: {
        type: 'string',
        errorMessage: 'City must be a string',
      },
      coordinates: {
        type: 'object',
        properties: {
          latitude: { type: 'string' },
          longitude: { type: 'string' },
        },
      },
      capacity: {
        type: 'number',
        minimum: 1,
        errorMessage: 'Capacity must be a number',
      },
      startDate: {
        type: 'string',
        format: 'date',
        errorMessage: 'Start date must be a date',
      },
      endDate: {
        type: 'string',
        format: 'date',
        errorMessage: 'End date must be a date',
      },
      typeId: {
        type: 'number',
        errorMessage: 'Event type must be a valid id',
      },
      schedule: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date',
              errorMessage: 'Event schedule date must be a date',
            },
          },
        },
      },
      nearPlaces: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            address: { type: 'string' },
            coordinates: {
              type: 'object',
              properties: {
                latitude: { type: 'string' },
                longitude: { type: 'string' },
              },
            },
          },
        },
      },
      createdBy: { type: 'string' },
    },
  },
  response: {
    201: responseSchema(201, null, {
      type: 'object',
      properties: {
        id: { type: 'number', default: 1 },
        name: { type: 'string' },
        description: { type: 'string' },
        location: { type: 'string' },
        address: { type: 'string' },
        city: { type: 'string' },
        coordinates: {
          type: 'object',
          properties: {
            latitude: { type: 'string' },
            longitude: { type: 'string' },
          },
        },
        startDate: { type: 'string', format: 'date' },
        endDate: { type: 'string', format: 'date' },
        capacity: { type: 'number' },
        registeredCount: { type: 'number' },
        evenType: {
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
              date: { type: 'string', format: 'date' },
            },
          },
        },
        nearPlaces: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', default: 1 },
              name: { type: 'string' },
              address: { type: 'string' },
              coordinates: {
                type: 'object',
                properties: {
                  latitude: { type: 'string' },
                  longitude: { type: 'string' },
                },
              },
            },
          },
        },
        createdBy: { type: 'string' },
      },
    }),
    400: responseSchema(400, true),
    403: responseSchema(403, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const getEventSchema = {
  tags: ['events'],
  summary: 'Get event',
  description: 'Get a single event by id',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'number' },
    },
  },
  response: {
    200: responseSchema(200, null, {
      type: 'object',
      properties: {
        id: { type: 'number', default: 1 },
        name: { type: 'string' },
        description: { type: 'string' },
        location: { type: 'string' },
        address: { type: 'string' },
        city: { type: 'string' },
        coordinates: {
          type: 'object',
          properties: {
            latitude: { type: 'string' },
            longitude: { type: 'string' },
          },
        },
        startDate: { type: 'string', format: 'date' },
        endDate: { type: 'string', format: 'date' },
        capacity: { type: 'number' },
        registeredCount: { type: 'number' },
        eventType: {
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
              date: { type: 'string', format: 'date' },
            },
          },
        },
        nearPlaces: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', default: 1 },
              name: { type: 'string' },
              address: { type: 'string' },
              coordinates: {
                type: 'object',
                properties: {
                  latitude: { type: 'string' },
                  longitude: { type: 'string' },
                },
              },
            },
          },
        },
        createdBy: { type: 'string' },
      },
    }),
    400: responseSchema(400, true),
    403: responseSchema(403, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const getAllEventsSchema = {
  tags: ['events'],
  summary: 'Get all events',
  description: 'Get all events',
  response: {
    200: responseSchema(200, null, {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', default: 1 },
          name: { type: 'string' },
          description: { type: 'string' },
          location: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string' },
          coordinates: {
            type: 'object',
            properties: {
              latitude: { type: 'string' },
              longitude: { type: 'string' },
            },
          },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          capacity: { type: 'number' },
          registeredCount: { type: 'number' },
          eventType: {
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
                date: { type: 'string', format: 'date' },
              },
            },
          },
          nearPlaces: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'number', default: 1 },
                name: { type: 'string' },
                address: { type: 'string' },
                coordinates: {
                  type: 'object',
                  properties: {
                    latitude: { type: 'string' },
                    longitude: { type: 'string' },
                  },
                },
              },
            },
          },
          createdBy: { type: 'string' },
        },
      },
    }),
    400: responseSchema(400, true),
    403: responseSchema(403, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const searchEventSchema = {
  tags: ['events'],
  summary: 'Search events',
  description: 'Search events by name',
  querystring: {
    type: 'object',
    required: ['q'],
    properties: {
      q: { type: 'string' },
    },
  },
  response: {
    200: responseSchema(200, null, {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', default: 1 },
          name: { type: 'string' },
          description: { type: 'string' },
          location: { type: 'string' },
          address: { type: 'string' },
          city: { type: 'string' },
          coordinates: {
            type: 'object',
            properties: {
              latitude: { type: 'string' },
              longitude: { type: 'string' },
            },
          },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          capacity: { type: 'number' },
          registeredCount: { type: 'number' },
          eventType: {
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
                date: { type: 'string', format: 'date' },
              },
            },
          },
          nearPlaces: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', default: 1 },
                name: { type: 'string' },
                address: { type: 'string' },
                coordinates: {
                  type: 'object',
                  properties: {
                    latitude: { type: 'string' },
                    longitude: { type: 'string' },
                  },
                },
              },
            },
          },
          createdBy: { type: 'string' },
        },
      },
    }),
    400: responseSchema(400, true),
    403: responseSchema(403, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const deleteEventSchema = {
  tags: ['events'],
  summary: 'Delete event',
  description: 'Delete an event by id',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'number' },
    },
  },
  response: {
    204: {
      type: 'string',
      description: 'No content',
    },
    400: responseSchema(400, true),
    403: responseSchema(403, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const uploadEventSchema = {
  tags: ['events'],
  consumes: ['multipart/form-data'],
  summary: 'Upload events from a template',
  description: 'Upload events from a template',
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
    201: responseSchema(201, null, {
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
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const templateEventSchema = {
  tags: ['events'],
  summary: 'Download event template',
  description: 'Download event template',
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

const updateEventSchema = {
  ...createEventSchema,
  summary: 'Update event',
  description: 'Update an event by id',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'number' },
    },
  },
};

const eventSchema = {
  get: getEventSchema,
  getAll: getAllEventsSchema,
  search: searchEventSchema,
  create: createEventSchema,
  update: updateEventSchema,
  delete: deleteEventSchema,
  upload: uploadEventSchema,
  template: templateEventSchema,
};

export { eventSchema };
