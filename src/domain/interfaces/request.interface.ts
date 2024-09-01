import { FastifyRequest } from 'fastify';

import { UserDTO } from '../dto/users.dto';

interface IRequest extends FastifyRequest {
  user: UserDTO;
}

export default IRequest;
