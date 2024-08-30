import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import { eventSchema } from '../../domain/schemas/event.schema';
import { EventDTO } from '../../domain/entities/dto/events.dto';
import EventUseCase from '../../application/use_cases/event.usecase';
import { UserDTO } from '../../domain/entities/dto/users.dto';

class EventRoutes {
  public prefix_route = '/events';

  routes(
    instance: FastifyInstance,
    _options: FastifyPluginOptions,
    done: Function,
  ) {
    const eventUseCase = EventUseCase.getInstance(instance.config);

    instance.post<{ Body: EventDTO; Reply: EventDTO }>(
      '',
      {
        schema: eventSchema.create,
        preValidation: [instance.authorize],
      },
      async (request, reply) => {
        const response = await eventUseCase.create(
          request.body,
          (request.user as any).user as UserDTO,
        );
        reply.send(response);
      },
    );

    instance.get(
      '',
      {
        preValidation: [instance.authorize],
      },
      async (request, reply) => {
        reply.send('Eventos registrados');
      },
    );

    instance.get(
      '/:id',
      {
        preValidation: [instance.authorize],
      },
      async (request: any, reply) => {
        reply.send(`Evento con id ${request.params.id}`);
      },
    );

    instance.put(
      '/:id',
      {
        schema: eventSchema.update,
        preValidation: [instance.authorize],
      },
      async (request: any, reply) => {
        reply.send(`Actualizando evento con id ${request.params.id}`);
      },
    );

    instance.delete(
      '/:id',
      {
        preValidation: [instance.authorize],
      },
      async (request: any, reply) => {
        reply.send(`Eliminando evento con id ${request.params.id}`);
      },
    );

    done();
  }
}

export default EventRoutes;
