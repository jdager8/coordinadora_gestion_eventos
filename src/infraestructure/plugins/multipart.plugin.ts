import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import fastifyMultipart from '@fastify/multipart';

function fastifyMultipartPlugin(
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
  done: Function,
) {
  instance
    .register(fastifyMultipart, { attachFieldsToBody: true })
    .ready((err) => {
      if (err) console.error(err);
      instance.log.info('Multipart loaded');
    });

  done();
}

export default fastifyPlugin(fastifyMultipartPlugin);
