import { responseSchema } from './base.schema';

const getAllSchema = {
  tags: ['users'],
  response: {
    200: responseSchema(200, null, {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', default: 1 },
              username: { type: 'string' },
              role: {
                type: 'object',
                properties: {
                  id: { type: 'number', default: 1 },
                  role: { type: 'string' },
                },
              },
              person: {
                type: 'object',
                properties: {
                  id: { type: 'number', default: 1 },
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
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

const userSchema = {
  getAll: getAllSchema,
};

export { userSchema };
