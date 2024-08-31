import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import EventUseCase from '../../application/use_cases/event.usecase';

import { EventDTO } from '../../domain/dto/events.dto';
import { UserDTO } from '../../domain/dto/users.dto';

import { eventSchema } from '../../domain/schemas/event.schema';

class EventRoutes {
  public prefix_route = '/events';

  routes(
    instance: FastifyInstance,
    _options: FastifyPluginOptions,
    done: Function,
  ) {
    const eventUseCase = EventUseCase.getInstance(instance.config);

    // GET
    instance.get<{ Reply: EventDTO[] }>(
      '',
      {
        schema: eventSchema.getAll,
        preValidation: [instance.authorize],
      },
      async (_request, reply) => {
        const response = await eventUseCase.findAll();
        reply.send(response);
      },
    );

    instance.get<{ Params: { id: number }; Reply: EventDTO }>(
      '/:id',
      {
        schema: eventSchema.get,
        preValidation: [instance.authorize, instance.adminUser],
      },
      async (request, reply) => {
        const response = await eventUseCase.findById(request.params.id);
        reply.send(response);
      },
    );

    instance.get<{ Querystring: { q: string }; Reply: EventDTO[] }>(
      '/search',
      {
        schema: eventSchema.search,
        preValidation: [instance.authorize],
      },
      async (request, reply) => {
        const response = await eventUseCase.searchEvents(request.query.q);
        reply.send(response);
      },
    );

    // POST
    instance.post<{ Body: EventDTO; Reply: EventDTO }>(
      '',
      {
        schema: eventSchema.create,
        preValidation: [instance.authorize, instance.adminUser],
      },
      async (request, reply) => {
        const response = await eventUseCase.create(
          request.body,
          (request.user as any).user as UserDTO,
        );
        reply.send(response);
      },
    );

    // PUT
    instance.put<{ Params: { id: number }; Body: EventDTO; Reply: EventDTO }>(
      '/:id',
      {
        schema: eventSchema.update,
        preValidation: [instance.authorize, instance.adminUser],
      },
      async (request, reply) => {
        const response = await eventUseCase.update(
          request.params.id,
          request.body,
          (request.user as any).user as UserDTO,
        );
        reply.send(response);
      },
    );

    // DELETE
    instance.delete<{ Params: { id: number } }>(
      '/:id',
      {
        schema: eventSchema.delete,
        preValidation: [instance.authorize, instance.adminUser],
      },
      async (request, reply) => {
        await eventUseCase.delete(
          request.params.id,
          (request.user as any).user as UserDTO,
        );
        reply.code(204).send();
      },
    );

    done();
  }
}

export default EventRoutes;
