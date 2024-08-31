import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import { IResponse } from '../../domain/interfaces/response.interface';

import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ForeignKeyConstraintException,
  DuplicateException,
} from '../../application/exceptions/exceptions';

function errorHandler(
  error: FastifyError,
  _request: FastifyRequest,
  reply: FastifyReply,
): FastifyReply {
  let errorResponse: IResponse = {
    error: true,
    data: null,
    message: error.message,
    statusCode: 500,
  };

  if (error.validation) {
    console.log(error.validation);
    errorResponse.statusCode = 400;
    errorResponse.message = error.validation.map((e) => e.message).join(', ');
    return reply.code(400).send(errorResponse);
  }

  if (error instanceof NotFoundException) {
    errorResponse.statusCode = 404;

    return reply.code(404).send(errorResponse);
  }

  if (
    error instanceof BadRequestException ||
    error instanceof ForeignKeyConstraintException ||
    error instanceof DuplicateException
  ) {
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
