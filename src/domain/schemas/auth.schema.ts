const loginSchema = {
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
    400: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    500: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};

const registerSchema = {
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
    201: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        username: { type: 'string' },
        email: { type: 'string' },
        roleId: { type: 'number' },
        person: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            idNumber: { type: 'string' },
          },
        },
      },
    },
    400: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    500: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};

const authSchema = {
  login: loginSchema,
  register: registerSchema,
};

export { authSchema };
