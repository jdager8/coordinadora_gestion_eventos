import { FastifyInstance } from 'fastify';

import UserUseCase from './user.usecase';

import UserRepository from '../../infraestructure/repositories/user.repository';

import { LoginDTO, RegisterDTO } from '../../domain/entities/dto/auth.dto';
import { UserDTO } from '../../domain/entities/dto/users.dto';

import { BadRequestException } from '../exceptions/exceptions';

import { DatabaseConfig } from '../../infraestructure/database/postgres/types';

class AuthUseCase {
  private static instance: AuthUseCase;
  private userRepository: UserRepository;
  private userUseCase: UserUseCase;

  constructor(config: DatabaseConfig) {
    this.userRepository = UserRepository.getInstance(config);
    this.userUseCase = UserUseCase.getInstance(config);
  }

  public static getInstance(config: DatabaseConfig): AuthUseCase {
    if (!this.instance) {
      this.instance = new AuthUseCase(config);
    }
    return this.instance;
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
