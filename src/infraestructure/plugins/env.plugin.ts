import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifyEnv from '@fastify/env';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      EM_DB_HOST: string;
      EM_DB_PORT: number;
      EM_DB_USER: string;
      EM_DB_PASSWORD: string;
      EM_DB_NAME: string;
      EM_DB_DRIVER: 'pg';
      EM_DB_SCHEMA: string;
      EM_DB_MIGRATIONS_TABLE: string;
      EM_DB_MIGRATIONS_FOLDER: string;
      EM_JWT_SECRET: string;
    };
  }
}

function fastifyEnvPlugin(
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
  done: Function,
) {
  const schema = {
    type: 'object',
    required: [
      'EM_DB_HOST',
      'EM_DB_PORT',
      'EM_DB_USER',
      'EM_DB_PASSWORD',
      'EM_DB_NAME',
      'EM_DB_DRIVER',
      'EM_DB_SCHEMA',
      'EM_DB_MIGRATIONS_TABLE',
      'EM_DB_MIGRATIONS_FOLDER',
    ],
    properties: {
      EM_DB_HOST: {
        type: 'string',
      },
      EM_DB_PORT: {
        type: 'number',
      },
      EM_DB_USER: {
        type: 'string',
      },
      EM_DB_PASSWORD: {
        type: 'string',
      },
      EM_DB_NAME: {
        type: 'string',
      },
      EM_DB_DRIVER: {
        type: 'string',
      },
      EM_DB_SCHEMA: {
        type: 'string',
      },
      EM_DB_MIGRATIONS_TABLE: {
        type: 'string',
      },
      EM_DB_MIGRATIONS_FOLDER: {
        type: 'string',
      },
      EM_JWT_SECRET: {
        type: 'string',
      },
    },
  };

  instance
    .register(fastifyEnv, {
      schema,
      dotenv: {
        path: `.env.${process.env.NODE_ENV}`,
      },
    })
    .ready((err) => {
      if (err) console.error(err);
      instance.log.info('Environment variables loaded');
    });

  done();
}

export default fastifyPlugin(fastifyEnvPlugin);
