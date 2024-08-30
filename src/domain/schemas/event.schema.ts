import { format } from 'path';
import { responseSchema } from './base.schema';

const createUpdateEventSchema = {
  tags: ['events'],
  body: {
    type: 'object',
    required: [
      'name',
      'description',
      'location',
      'capacity',
      'startDate',
      'endDate',
      'eventTypeId',
      'eventSchedule',
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
      eventTypeId: {
        type: 'number',
        errorMessage: 'Event type must be a valid id',
      },
      eventSchedule: {
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
      eventNearPlaces: {
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
        eventSchedule: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', default: 1 },
              date: { type: 'string', format: 'date' },
            },
          },
        },
        eventNearPlaces: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', default: 1 },
              name: { type: 'string' },
              address: { type: 'string' },
              coordinates: { type: 'string' },
            },
          },
        },
      },
    }),
    400: responseSchema(400, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const eventSchema = {
  create: createUpdateEventSchema,
  update: createUpdateEventSchema,
};

export { eventSchema };
