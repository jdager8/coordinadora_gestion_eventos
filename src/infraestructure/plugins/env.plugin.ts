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
      EM_JWT_EXPIRES_IN: string;
      EM_MAPBOX_API_URL: string;
      EM_MAPBOX_TOKEN: string;
      EM_MAPBOX_TYPES_LIMIT: number;
      EM_MAPBOX_RADIUS_LIMIT: number;
      EM_MAPBOX_FILTER_TYPES: string;
      EM_FILE_SIZE_LIMIT: number;
      EM_FILE_LIMIT: number;
      EM_FILE_ALLOWED_EXTENSIONS: string;
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
      'EM_JWT_SECRET',
      'EM_JWT_EXPIRES_IN',
      'EM_MAPBOX_API_URL',
      'EM_MAPBOX_TOKEN',
      'EM_MAPBOX_TYPES_LIMIT',
      'EM_MAPBOX_RADIUS_LIMIT',
      'EM_MAPBOX_FILTER_TYPES',
      'EM_FILE_SIZE_LIMIT',
      'EM_FILE_LIMIT',
      'EM_FILE_ALLOWED_EXTENSIONS',
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
      EM_JWT_EXPIRES_IN: {
        type: 'string',
      },
      EM_MAPBOX_API_URL: {
        type: 'string',
      },
      EM_MAPBOX_TOKEN: {
        type: 'string',
      },
      EM_MAPBOX_TYPES_LIMIT: {
        type: 'number',
      },
      EM_MAPBOX_RADIUS_LIMIT: {
        type: 'number',
      },
      EM_MAPBOX_FILTER_TYPES: {
        type: 'string',
      },
      EM_FILE_SIZE_LIMIT: {
        type: 'number',
      },
      EM_FILE_LIMIT: {
        type: 'number',
      },
      EM_FILE_ALLOWED_EXTENSIONS: {
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
