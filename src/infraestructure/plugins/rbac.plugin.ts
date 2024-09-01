import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import { UserDTO } from '../../domain/dto/users.dto';

import { ForbiddenException } from '../../application/exceptions/exceptions';

declare module 'fastify' {
  export interface FastifyInstance {
    adminUser(request: FastifyRequest, reply: FastifyReply): void;
  }
}

function fastifyRbacPlugin(
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
  done: Function,
) {
  instance.decorate(
    'adminUser',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const user = (request.user as any).user as UserDTO;
      if (user.role.role !== 'admin') {
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      }
    },
  );

  done();
}

export default fastifyPlugin(fastifyRbacPlugin);
