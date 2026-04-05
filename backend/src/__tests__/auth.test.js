const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Admin User', email: 'admin@conexra.test', password: 'Password123', role: 'admin' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  it('should login existing user', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Employee User', email: 'employee@conexra.test', password: 'Password123', role: 'employee' });

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'employee@conexra.test', password: 'Password123' });

    expect(login.statusCode).toBe(200);
    expect(login.body).toHaveProperty('token');
    expect(login.body.user).toMatchObject({ email: 'employee@conexra.test', role: 'employee' });
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@conexra.test', password: 'wrong' });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });
});
