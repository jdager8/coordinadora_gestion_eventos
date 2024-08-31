import { UserDTO } from './users.dto';

interface LoginDTO {
  username: string;
  password: string;
}

interface AuthDTO {
  token: string;
}

interface RegisterDTO extends Omit<UserDTO, 'role'> {
  roleId?: number;
}

export { LoginDTO, RegisterDTO, AuthDTO };
