import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import UserUseCase from '../../application/use_cases/user.usecase';

import { UserDTO } from '../../domain/dto/users.dto';

import { userSchema } from '../../domain/schemas/user.schema';

class UserRoutes {
  public prefix_route = '/users';

  routes(
    instance: FastifyInstance,
    _options: FastifyPluginOptions,
    done: Function,
  ) {
    const userUseCase = UserUseCase.getInstance(instance.config);

    // GET
    instance.get<{ Reply: any }>(
      '',
      {
        schema: userSchema.getAll,
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

export default UserRoutes;
