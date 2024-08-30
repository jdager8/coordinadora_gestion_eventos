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
          description: 'API for Event Manager',
          version: '0.1.0',
        },
        servers: [
          {
            url: 'http://localhost:3000',
            description: 'Development server',
          },
        ],
      },
    })
    .ready((err) => {
      if (err) console.error(err);
      instance.log.info('Swagger loaded');
    });

  instance.register(fastifySwaggerUi).ready((err) => {
    if (err) console.error(err);
    instance.log.info('Swagger UI loaded');
  });

  done();
}

export default fastifyPlugin(fastifySwaggerPlugin);
