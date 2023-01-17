import { app } from '../../index';
import generateToken from '../../utils/generateToken';
import database from '../../configs/db.config';
import supertest from 'supertest';

const request = supertest(app);

describe('Test User Routes', () => {
  const TestingToken = generateToken(1);

  it('test create a new user route "POST: /api/users/create"', async () => {
    const response = await request
      .post('/api/users/create')
      .send({
        firstname: 'hassan',
        lastname: 'ali',
        password: '123456',
      })
      .set('Authorization', `Bearer ${TestingToken}`);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(1);
    expect(response.body.firstname).toBe('hassan');
    expect(response.body.lastname).toBe('ali');
    expect(response.body.token).toBeDefined();
  });

  it('test get all user route "GET: /api/users"', async () => {
    const response = await request
      .get('/api/users')
      .set('Authorization', `Bearer ${TestingToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toHaveSize(1);
    expect(response.body[0].id).toBe(1);
  });

  it('test get a user route "GET: /api/users/1"', async () => {
    const response = await request
      .get('/api/users/1')
      .set('Authorization', `Bearer ${TestingToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(1);
    expect(response.body.firstname).toBe('hassan');
    expect(response.body.lastname).toBe('ali');
  });

  it('test delete a user route "DELETE: /api/users/:id"', async () => {
    const response = await request
      .delete('/api/users/1')
      .set('Authorization', `Bearer ${TestingToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.id).toBe(1);
    expect(response.body.firstname).toBe('hassan');
    expect(response.body.lastname).toBe('ali');
  });

  afterAll(async () => {
    const connection = await database.connect();
    const sql = 'ALTER SEQUENCE users_id_seq RESTART WITH 1;';

    await connection.query(sql);

    connection.release();
  });
});
