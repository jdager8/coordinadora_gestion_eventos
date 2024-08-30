import {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '../../application/exceptions/exceptions';

function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
): FastifyReply {
  let errorResponse = {
    error: true,
    data: null,
    message: error.message,
    statusCode: 500,
  };

  if (error instanceof NotFoundException) {
    errorResponse.statusCode = 404;

    return reply.code(404).send(errorResponse);
  }

  if (error instanceof BadRequestException) {
    errorResponse.statusCode = 400;
    return reply.code(400).send(errorResponse);
  }

  if (error instanceof UnauthorizedException) {
    errorResponse.statusCode = 401;
    return reply.code(401).send(errorResponse);
  }

  if (error instanceof ForbiddenException) {
    errorResponse.statusCode = 403;
    return reply.code(403).send(errorResponse);
  }

  return reply.code(500).send(errorResponse);
}

export { errorHandler };
