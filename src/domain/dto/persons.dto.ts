interface PersonDTO {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  idNumber: string;
}

interface CreatePersonDTO extends Omit<PersonDTO, 'id'> {}

interface UpdatePersonDTO extends Partial<PersonDTO> {}

export { PersonDTO, CreatePersonDTO, UpdatePersonDTO };
