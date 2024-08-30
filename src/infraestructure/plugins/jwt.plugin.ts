import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyJwt from '@fastify/jwt';
import fastifyPlugin from 'fastify-plugin';
import { ForbiddenException } from '../../application/exceptions/exceptions';

declare module 'fastify' {
  export interface FastifyInstance {
    authorize(request: FastifyRequest, reply: FastifyReply): void;
  }
}

function fastifyJwtPlugin(
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
  done: Function,
) {
  instance.register(fastifyJwt, {
    secret: instance.config.EM_JWT_SECRET,
    sign: {
      expiresIn: instance.config.EM_JWT_EXPIRES_IN,
    },
  });

  instance.decorate(
    'authorize',
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (error: any) {
        throw new ForbiddenException(
          "You don't have permission to access this resource",
        );
      }
    },
  );

  done();
}

export default fastifyPlugin(fastifyJwtPlugin);
