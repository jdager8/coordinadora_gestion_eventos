import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

function fastifySwaggerPlugin(
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
  done: Function,
) {
  instance
    .register(fastifySwagger, {
      openapi: {
        info: {
          title: 'Event Manager API',
          description:
            'API for Event Manager. All the routes are protected except the auth routes. There are a bug in the swagger plugin that does not allow to set the security schema for the routes.',
          version: '0.1.0',
        },
        servers: [
          {
            url: 'http://localhost:3000',
            description: 'Development server',
          },
        ],
        tags: [
          { name: 'auth', description: 'Auth routes' },
          { name: 'users', description: 'Users routes' },
          { name: 'events', description: 'Events routes' },
          { name: 'enrollments', description: 'Enrollments routes' },
          { name: 'attendances', description: 'Attendances routes' },
          { name: 'reports', description: 'Reports routes' },
        ],
      },
    })
    .ready((err) => {
      if (err) console.error(err);
      instance.log.info('Swagger loaded');
    });

  instance
    .register(fastifySwaggerUi, {
      routePrefix: '/docs',
    })
    .ready((err) => {
      if (err) console.error(err);
      instance.log.info('Swagger UI loaded');
    });

  done();
}

export default fastifyPlugin(fastifySwaggerPlugin);
