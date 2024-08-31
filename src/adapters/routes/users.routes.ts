import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import { eventSchema } from '../../domain/schemas/event.schema';
import { EventDTO } from '../../domain/dto/events.dto';
import EventUseCase from '../../application/use_cases/event.usecase';
import { UserDTO } from '../../domain/dto/users.dto';
import UserUseCase from '../../application/use_cases/user.usecase';

class EventRoutes {
  public prefix_route = '/users';

  routes(
    instance: FastifyInstance,
    _options: FastifyPluginOptions,
    done: Function,
  ) {
    const userUseCase = UserUseCase.getInstance(instance.config);

    // GET
    instance.get(
      '',
      {
        schema: eventSchema.getAll,
        preValidation: [instance.authorize],
      },
      async (_request, reply) => {
        //const response = await userUseCase.findAll();
        reply.send('');
      },
    );

    done();
  }
}

export default EventRoutes;
