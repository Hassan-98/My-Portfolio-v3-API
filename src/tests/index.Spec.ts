import supertest from 'supertest';
import { app } from '../index';

const request = supertest(app);

describe('Test Server Status', () => {
  it('should return 200 OK for successful health check', async () => {
    const response = await request.get('/health-check');
    expect(response.status).toBe(200);
  });
});
