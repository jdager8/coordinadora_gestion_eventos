import PostgresDatabase from '../database/postgres/postgres.db';

import { UserDTO } from '../../domain/dto/users.dto';
import { RegisterDTO } from '../../domain/dto/auth.dto';

import EncryptUtils from '../../helpers/encrypt-utils';

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

  async findAll(): Promise<UserDTO[]> {
    // 1. Find all users
    const users = await this.db.executeQuery(
      `SELECT
        json_build_object(
          'id', u.id,
          'username', u.username,
          'role', json_build_object(
            'id', u.id_roles,
            'role', r.role
          ),
          'person', json_build_object(
            'id', p.id,
            'firstname', p.firstname,
            'lastname', p.lastname,
            'email', p.email,
            'idNumber', p.id_number
          )
        ) AS user_data
       FROM
        users u
        JOIN persons p ON u.id_persons = p.id
        JOIN roles r ON u.id_roles = r.id`,
    );

    // 2. Return the users
    return users.rows.map((user) => user.user_data as UserDTO);
  }

  async findByUsername(username: string): Promise<UserDTO> {
    // 1. Find the user by username
    const user = await this.db.executeQuery(
      `SELECT
        json_build_object(
          'id', u.id,
          'username', u.username,
          'password', u.password,
          'role', json_build_object(
            'id', u.id_roles,
            'role', r.role
          ),
          'person', json_build_object(
            'id', p.id,
            'firstname', p.firstname,
            'lastname', p.lastname,
            'email', p.email,
            'id_number', p.id_number
          )
        ) AS user_data
       FROM
        users u
        JOIN persons p ON u.id_persons = p.id
        JOIN roles r ON u.id_roles = r.id
      WHERE username = $1`,
      [username],
    );

    // 2. Return the user
    if (user.rows.length === 1) {
      return user.rows[0].user_data as UserDTO;
    } else {
      throw new NotFoundException(`User not found: ${username}`);
    }
  }

  async findById(id: number): Promise<UserDTO | null> {
    // 1. Find the user by id
    const user = await this.db.executeQuery(
      `SELECT
        json_build_object(
          'id', u.id,
          'username', u.username,
          'password', u.password,
          'role', json_build_object(
            'id', u.id_roles,
            'role', r.role
          ),
          'person', json_build_object(
            'id', p.id,
            'firstname', p.firstname,
            'lastname', p.lastname,
            'email', p.email,
            'id_number', p.id_number
          )
        ) AS user_data
       FROM
        users u
        JOIN persons p ON u.id_persons = p.id
        JOIN roles r ON u.id_roles = r.id
      WHERE u.id = $1`,
      [id],
    );

    // 2. Return the user
    if (user.rows.length === 1) {
      return user.rows[0].user_data as UserDTO;
    } else {
      return null;
    }
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
        hashedPassword = await EncryptUtils.hash(user.password);
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
    const returnUser = await this.findById(newUser.rows[0].id);
    if (returnUser) {
      return returnUser;
    } else {
      throw new BadRequestException('Error creating user');
    }
  }
}

export default UserRepository;
