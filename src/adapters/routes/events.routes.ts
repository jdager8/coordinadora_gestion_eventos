import { FastifyInstance, FastifyPluginOptions } from 'fastify';

class EventRoutes {
  public prefix_route = '/events';

  routes(
    instance: FastifyInstance,
    _options: FastifyPluginOptions,
    done: Function,
  ) {
    instance.post('', {}, async (request, reply) => {
      reply.send('Creando evento');
    });

    instance.get('', {}, async (request, reply) => {
      reply.send('Eventos registrados');
    });

    done();
  }
}

export default EventRoutes;
