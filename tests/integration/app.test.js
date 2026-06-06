process.env.NODE_ENV = 'test';
process.env.DB_DIALECT = 'sqlite';
process.env.JWT_SECRET = 'test_secret';

const request = require('supertest');
const app = require('../../src/config/app');
const { sequelize } = require('../../src/models');

describe('TaskMaster API integration', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('GET /health returns ok', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('POST /api/v1/auth/register creates a user and returns token', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'SecurePass123!'
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toBe('jane@example.com');
  });

  test('POST /api/v1/auth/login authenticates existing user', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({
      email: 'jane@example.com',
      password: 'SecurePass123!'
    });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.user.name).toBe('Jane Doe');
  });
});
