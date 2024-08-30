import { PersonDTO } from './persons.dto';

interface UserDTO {
  id: number;
  username: string;
  email: string;
  password?: string;
  person: PersonDTO;
}

export { UserDTO };
