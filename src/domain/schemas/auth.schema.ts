import { responseSchema } from './base.schema';

const loginSchema = {
  tags: ['auth'],
  summary: 'Login',
  description: 'Login',
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
  },
  response: {
    200: responseSchema(200, null, {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    }),
    400: responseSchema(400, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const registerSchema = {
  tags: ['auth'],
  summary: 'Register',
  description: 'Register',
  body: {
    type: 'object',
    required: ['username', 'password', 'roleId', 'person'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
      roleId: { type: 'number' },
      person: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'idNumber'],
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          idNumber: { type: 'string' },
        },
      },
    },
  },
  response: {
    201: responseSchema(201, null, {
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
    }),
    400: responseSchema(400, true),
    404: responseSchema(404, true),
    500: responseSchema(500, true),
  },
};

const authSchema = {
  login: loginSchema,
  register: registerSchema,
};

export { authSchema };
