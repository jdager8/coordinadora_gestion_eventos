import { PersonDTO } from './persons.dto';

interface UserDTO {
  id: number;
  username: string;
  email: string;
  person: PersonDTO;
}

export { UserDTO };
