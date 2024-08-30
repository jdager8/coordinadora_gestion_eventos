import UserRepository from '../../infraestructure/repositories/user.repository';

import { UserDTO } from '../../domain/entities/dto/users.dto';

import PasswordHash from '../../helpers/passwordHash';

import { BadRequestException } from '../exceptions/exceptions';

class UserUseCase {
  private static instance: UserUseCase;
  private userRepository: UserRepository;

  constructor(config: any) {
    this.userRepository = UserRepository.getInstance(config);
  }

  public static getInstance(config: any): UserUseCase {
    if (!this.instance) {
      this.instance = new UserUseCase(config);
    }
    return this.instance;
  }

  async verifyUser(username: string, password: string): Promise<UserDTO> {
    // 1. Find user by username
    const user = await this.userRepository.findByUsername(username);

    // 2. Verify password
    if (user.password) {
      const isValid = await PasswordHash.compare(password, user.password);
      if (isValid) {
        return user;
      }
    }

    throw new BadRequestException('Email or password is invalid');
  }
}

export default UserUseCase;
