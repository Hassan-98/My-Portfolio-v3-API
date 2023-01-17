import bcrypt from 'bcrypt';
import database from '../../configs/db.config';
import UserModel from '../../models/User.model';
import config from '../../configs/vars.config';

import { User } from '../../types/User.interface';

const USER = new UserModel();

const { bcrypt: BCRYPT } = config;

describe('Test User Model', () => {
  it('getUsers method should be exists', () => {
    expect(USER.getUsers).toBeDefined();
  });

  it('getUserById method should be exists', () => {
    expect(USER.getUserById).toBeDefined();
  });

  it('createUser method should be exists', () => {
    expect(USER.createUser).toBeDefined();
  });

  it('deleteUser method should be exists', () => {
    expect(USER.deleteUser).toBeDefined();
  });

  it('test creating a new user using createUser method', async () => {
    const user: User = await USER.createUser({
      firstname: 'hassan',
      lastname: 'ali',
      password: 'hassanali123',
    });

    expect(user.id).toBe(1);
    expect(user.firstname).toBe('hassan');
    expect(user.lastname).toBe('ali');
    expect(user.password).not.toEqual('hassanali123');
    expect(
      bcrypt.compareSync('hassanali123' + BCRYPT.secret, user.password)
    ).toBe(true);
    expect(user.token).toBeDefined();
  });

  it('test get all users using getUsers method', async () => {
    const users: User[] = await USER.getUsers();

    expect(users).toHaveSize(1);
    expect(users[0].id).toEqual(1);
    expect(users[0].firstname).toEqual('hassan');
    expect(users[0].lastname).toEqual('ali');
  });

  it('test get user using getUserById method', async () => {
    const id = 1;
    const user: User = await USER.getUserById(id);

    expect(user.id).toEqual(id);
    expect(user.firstname).toEqual('hassan');
    expect(user.lastname).toEqual('ali');
    expect(user.password).not.toEqual('hassanali123');
    expect(
      bcrypt.compareSync('hassanali123' + BCRYPT.secret, user.password)
    ).toBe(true);
  });

  it('test delete user using deleteProduct method', async () => {
    const id = 1;
    const user: User = await USER.deleteUser(id);

    expect(user.id).toEqual(id);
    expect(user.firstname).toBe('hassan');
    expect(user.lastname).toBe('ali');
  });

  afterAll(async () => {
    const connection = await database.connect();
    const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;';

    await connection.query(sql);

    connection.release();
  });
});
