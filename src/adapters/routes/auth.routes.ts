import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import AuthUseCase from '@/application/use_cases/auth.usecase';

import { RegisterDTO } from '@/domain/entities/dto/auth.dto';
import { UserDTO } from '@/domain/entities/dto/user.dto';

class AuthRoutes {
  public prefix_route = '/auth';

  routes(
    instance: FastifyInstance,
    _options: FastifyPluginOptions,
    done: Function,
  ) {
    const authUseCase = new AuthUseCase(instance.config);

    instance.post('/login', {}, async (request, reply) => {
      reply.send('Login');
    });

    instance.post<{ Body: RegisterDTO; Reply: UserDTO }>(
      '/register',
      {},
      async (request, reply) => {
        const response = await authUseCase.register(request.body);
        reply.send(response);
      },
    );

    done();
  }
}

export default AuthRoutes;
