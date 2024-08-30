import PostgresDatabase from '../database/postgres/postgres.db';

import { UserDTO } from '../../domain/entities/dto/users.dto';
import { RegisterDTO } from '../../domain/entities/dto/auth.dto';

import PasswordHash from '../../helpers/passwordHash';

import {
  BadRequestException,
  NotFoundException,
} from '../../application/exceptions/exceptions';

import { DatabaseConfig } from '../database/postgres/types';

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
        `INSERT INTO
          persons (firstname, lastname, email, id_number)
         VALUES
          ($1, $2, $3, $4)
         RETURNING id`,
        [
          user.person.firstName,
          user.person.lastName,
          user.person.email,
          user.person.idNumber,
        ],
      );

      // 2. Create a new user
      let hashedPassword = '';
      if (user.password) {
        hashedPassword = await PasswordHash.hash(user.password);
      }

      newUser = await this.db.executeQuery(
        `INSERT INTO
          users (username, password, id_persons, id_roles)
         VALUES
          ($1, $2, $3, $4)
         RETURNING id`,
        [user.username, hashedPassword, person.rows[0].id, user.roleId],
      );

      await this.db.commitTransaction();
    } catch (error: any) {
      console.error(error);
      await this.db.rollbackTransaction();
      throw new BadRequestException(`Error creating user: ${error.message}`);
    }

    // 3. Return the new user
    return await this.findById(newUser.rows[0].id);
  }

  async findByUsername(username: string): Promise<UserDTO> {
    // 1. Find the user by username
    const user = await this.db.executeQuery(
      `SELECT
        *
       FROM
        users u
        JOIN persons p ON u.id_persons = p.id
        JOIN roles r ON u.id_roles = r.id
      WHERE username = $1`,
      [username],
    );

    // 2. Return the user
    if (user.rows.length > 0) {
      return {
        id: user.rows[0].id,
        username: user.rows[0].username,
        password: user.rows[0].password,
        role: { id: user.rows[0].id_roles, role: user.rows[0].role },
        person: {
          id: user.rows[0].id_persons,
          firstName: user.rows[0].firstname,
          lastName: user.rows[0].lastname,
          email: user.rows[0].email,
          idNumber: user.rows[0].id_number,
        },
      } as UserDTO;
    } else {
      throw new NotFoundException(`User not found: ${username}`);
    }
  }

  async findById(id: number): Promise<UserDTO> {
    // 1. Find the user by id
    const user = await this.db.executeQuery(
      `SELECT
        *
       FROM
        users u
        JOIN persons p ON u.id_persons = p.id
        JOIN roles r ON u.id_roles = r.id
      WHERE u.id = $1`,
      [id],
    );

    // 2. Return the user
    if (user.rows.length > 0) {
      return {
        id: user.rows[0].id,
        username: user.rows[0].username,
        password: user.rows[0].password,
        role: { id: user.rows[0].id_roles, role: user.rows[0].role },
        person: {
          id: user.rows[0].id_persons,
          firstName: user.rows[0].firstname,
          lastName: user.rows[0].lastname,
          email: user.rows[0].email,
          idNumber: user.rows[0].id_number,
        },
      } as UserDTO;
    } else {
      throw new NotFoundException(`User not found: ${id}`);
    }
  }
}

export default UserRepository;
