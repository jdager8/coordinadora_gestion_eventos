import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import UserUseCase from '../../application/use_cases/user.usecase';

import { UserDTO } from '../../domain/dto/users.dto';

class EventRoutes {
  public prefix_route = '/users';

  routes(
    instance: FastifyInstance,
    _options: FastifyPluginOptions,
    done: Function,
  ) {
    const userUseCase = UserUseCase.getInstance(instance.config);

    // GET
    instance.get<{ Reply: UserDTO[] }>(
      '',
      {
        schema: {
          tags: ['Users'],
        },
        preValidation: [instance.authorize, instance.adminUser],
      },
      async (_request, reply) => {
        const response = await userUseCase.findAll();
        reply.send(response);
      },
    );

    done();
  }
}

export default EventRoutes;
