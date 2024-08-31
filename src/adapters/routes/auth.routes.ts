import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import AuthUseCase from '../../application/use_cases/auth.usecase';

import { LoginDTO, RegisterDTO, AuthDTO } from '../../domain/dto/auth.dto';
import { UserDTO } from '../../domain/dto/users.dto';

import { authSchema } from '../../domain/schemas/auth.schema';

class AuthRoutes {
  public prefix_route = '/auth';

  routes(
    instance: FastifyInstance,
    _options: FastifyPluginOptions,
    done: Function,
  ) {
    const authUseCase = AuthUseCase.getInstance(instance.config);

    instance.post<{ Body: LoginDTO; Reply: AuthDTO }>(
      '/login',
      {
        schema: authSchema.login,
      },
      async (request, reply) => {
        const response = await authUseCase.login(request.body, instance);
        reply.send(response);
      },
    );

    instance.post<{ Body: RegisterDTO; Reply: UserDTO }>(
      '/register',
      {
        schema: authSchema.register,
      },
      async (request, reply) => {
        const response = await authUseCase.register(request.body);
        reply.send(response);
      },
    );

    done();
  }
}

export default AuthRoutes;
