import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyPlugin from 'fastify-plugin';

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate(request: FastifyRequest, reply: FastifyReply): void;
  }
}

function fastifyJwtPlugin(
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
  done: Function,
) {
  instance.register(fastifyJwt, {
    secret: 'supersecret',
  });

  instance.decorate(
    'authenticate',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (error) {
        reply.send(error);
      }
    },
  );

  done();
}

export default fastifyPlugin(fastifyJwtPlugin);
