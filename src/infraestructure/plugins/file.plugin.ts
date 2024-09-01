import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import fastifyPlugin from 'fastify-plugin';

import { UnexpectedFile } from '../../application/exceptions/exceptions';

import FileUtils from '../../helpers/file-utils';

declare module 'fastify' {
  export interface FastifyInstance {
    validateFile(request: FastifyRequest, reply: FastifyReply): void;
  }
}

function fastifyFilePlugin(
  instance: FastifyInstance,
  _options: FastifyPluginOptions,
  done: Function,
) {
  instance.decorate(
    'validateFile',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const file = (request as any).body.template;
      if (file) {
        if (
          !FileUtils.validateExtension(
            file.filename,
            instance.config.EM_FILE_ALLOWED_EXTENSIONS.split(','),
          )
        ) {
          throw new UnexpectedFile('Invalid file extension');
        }
      }
    },
  );

  done();
}

export default fastifyPlugin(fastifyFilePlugin);
