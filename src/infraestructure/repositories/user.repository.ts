import PostgresDatabase from '@/infraestructure/database/postgres/postgres.db';

import { UserDTO } from '@/domain/entities/dto/user.dto';
import { RegisterDTO } from '@/domain/entities/dto/auth.dto';
import { DatabaseConfig } from '@/infraestructure/database/postgres/types';
import PasswordHash from '@/helpers/passwordHash';

class UserRepository {
  private static instance: UserRepository;
  private db: PostgresDatabase;

  constructor(config: DatabaseConfig) {
    this.db = PostgresDatabase.getInstance(config);
  }

  public static getInstance(config: DatabaseConfig): UserRepository {
    if (!this.instance) {
      this.instance = new UserRepository(config);
    }
    return this.instance;
  }

  async create(user: RegisterDTO): Promise<UserDTO> {
    let newUser: any;
    let person: any;

    await this.db.beginTransaction();
    try {
      // 1. Create a new person
      person = await this.db.executeQuery(
        'INSERT INTO persons (firstname, lastname, email, id_number) VALUES ($1, $2, $3, $4) RETURNING id',
        [
          user.person.firstName,
          user.person.lastName,
          user.person.email,
          user.person.idNumber,
        ],
      );

      // 2. Create a new user
      const hashedPassword = await PasswordHash.hash(user.password);

      newUser = await this.db.executeQuery(
        'INSERT INTO users (username, password, id_persons, id_roles) VALUES ($1, $2, $3, $4) RETURNING id',
        [user.username, hashedPassword, person.rows[0].id, user.roleId],
      );

      await this.db.commitTransaction();
    } catch (error) {
      await this.db.rollbackTransaction();
      throw new Error('Error creating user');
    }

    // 3. Return the new user
    if (newUser.rows.length > 0) {
      return {
        id: newUser.rows[0].id,
        username: user.username,
        email: user.person.email,
        person: {
          id: person.rows[0].id,
          firstName: user.person.firstName,
          lastName: user.person.lastName,
          email: user.person.email,
          idNumber: user.person.idNumber,
        },
      } as UserDTO;
    } else {
      throw new Error('Error creating user');
    }
  }
}

export default UserRepository;
