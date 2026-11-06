require('./setup');
const request = require('supertest');
const app = require('../src/app');
const db = require('./helpers');

const user = { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', password: 'Passw0rd123' };

beforeAll(db.connect);
afterEach(db.clear);
afterAll(db.disconnect);

describe('Auth', () => {
  test('registers a user with role employee and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe('employee');
    expect(res.body.data.user.password).toBeUndefined();
  });

  test('ignores a role sent in the registration payload (no privilege escalation)', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...user, role: 'admin' });
    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe('employee');
  });

  test('rejects duplicate email', async () => {
    await request(app).post('/api/auth/register').send(user);
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(409);
  });

  test('rejects weak password with validation errors', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...user, password: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  test('logs in with correct credentials', async () => {
    await request(app).post('/api/auth/register').send(user);
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });

  test('rejects wrong password with a generic message', async () => {
    await request(app).post('/api/auth/register').send(user);
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: 'WrongPass1' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  test('GET /me requires a token', async () => {
    expect((await request(app).get('/api/auth/me')).status).toBe(401);
  });

  test('GET /me returns the current user', async () => {
    const reg = await request(app).post('/api/auth/register').send(user);
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${reg.body.data.token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(user.email);
  });
});
