import { PersonDTO } from './persons.dto';

interface LoginDTO {
  username: string;
  password: string;
}

interface RegisterDTO {
  username: string;
  password: string;
  roleId: number;
  person: PersonDTO;
}

export { LoginDTO, RegisterDTO };
