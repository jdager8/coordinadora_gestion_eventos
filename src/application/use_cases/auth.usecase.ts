import UserRepository from '@/infraestructure/repositories/user.repository';

import { LoginDTO, RegisterDTO } from '@/domain/entities/dto/auth.dto';
import { UserDTO } from '@/domain/entities/dto/user.dto';

class AuthUseCase {
  private userRepository: UserRepository;

  constructor(config: any) {
    this.userRepository = UserRepository.getInstance(config);
  }

  async login(credentials: LoginDTO): Promise<any> {
    return {};
  }

  async register(user: RegisterDTO): Promise<UserDTO> {
    const result = await this.userRepository.create(user);
    return result;
  }
}

export default AuthUseCase;
