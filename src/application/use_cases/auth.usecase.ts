import { FastifyInstance } from 'fastify';

import UserUseCase from './user.usecase';

import UserRepository from '../../infraestructure/repositories/user.repository';

import { LoginDTO, RegisterDTO } from '../../domain/entities/dto/auth.dto';
import { UserDTO } from '../../domain/entities/dto/user.dto';

import { BadRequestException } from '../exceptions/exceptions';

class AuthUseCase {
  private userRepository: UserRepository;
  private userUseCase: UserUseCase;

  constructor(config: any) {
    this.userRepository = UserRepository.getInstance(config);
    this.userUseCase = UserUseCase.getInstance(config);
  }

  async login(credentials: LoginDTO, instance: FastifyInstance): Promise<any> {
    const user = await this.userUseCase.verifyUser(
      credentials.username,
      credentials.password,
    );

    if (user) {
      const token = instance.jwt.sign({ user });
      return { token };
    }
    throw new BadRequestException('Email or password is invalid');
  }

  async register(user: RegisterDTO): Promise<UserDTO> {
    const result = await this.userRepository.create(user);
    return result;
  }
}

export default AuthUseCase;
