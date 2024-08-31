import { PersonDTO } from './persons.dto';
import { RoleDTO } from './roles.dto';

interface UserDTO {
  id: number;
  username: string;
  password?: string;
  role: RoleDTO;
  person: PersonDTO;
}

export { UserDTO };
