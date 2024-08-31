import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import { IResponse } from '../../domain/interfaces/response.interface';

function responseParserPlugin(
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
  done: Function,
) {
  instance.addHook(
    'preSerialization',
    (request: FastifyRequest, reply: FastifyReply, payload, done) => {
      if (request.url.includes('docs')) {
        done(null, payload);
      } else if (reply.statusCode === 200 || reply.statusCode === 201) {
        const statusCode = reply.statusCode;
        const message = 'Success';
        const data = payload;
        const error = statusCode >= 400;

        const formattedResponse: IResponse = {
          statusCode,
          message,
          data,
          error,
        };

        done(null, formattedResponse);
      } else {
        done(null, payload);
      }
    },
  );

  done();
}

export default fastifyPlugin(responseParserPlugin);
