import { responseSchema } from './base.schema';

const getReport = {
  tags: ['reports'],
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

const userSchema = {
  report: getReport,
};

export { userSchema };
