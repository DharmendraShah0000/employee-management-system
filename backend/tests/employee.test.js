require('./setup');
const request = require('supertest');
const app = require('../src/app');
const db = require('./helpers');
const User = require('../src/models/User');
const Employee = require('../src/models/Employee');

let adminToken;
let empToken;
let empRecordId;

const makeAdmin = async () => {
  const emp = await Employee.create({ employeeId: 'EMP-9999', firstName: 'Ada', lastName: 'Min', email: 'admin@test.com' });
  await User.create({ email: 'admin@test.com', password: 'Admin@12345', role: 'admin', employee: emp._id });
  const res = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'Admin@12345' });
  return res.body.data.token;
};

const makeEmployee = async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ firstName: 'Eve', lastName: 'Worker', email: 'eve@test.com', password: 'Passw0rd123' });
  return { token: res.body.data.token, employeeId: res.body.data.user.employee };
};

beforeAll(db.connect);
afterAll(db.disconnect);
beforeEach(async () => {
  await db.clear();
  adminToken = await makeAdmin();
  const emp = await makeEmployee();
  empToken = emp.token;
  empRecordId = emp.employeeId;
});

const auth = (t) => ({ Authorization: `Bearer ${t}` });

describe('Employee CRUD and authorization', () => {
  test('admin can create an employee with auto-generated id', async () => {
    const res = await request(app).post('/api/employees').set(auth(adminToken))
      .send({ firstName: 'Bob', lastName: 'Smith', email: 'bob@test.com', designation: 'Engineer', salary: 5000 });
    expect(res.status).toBe(201);
    expect(res.body.data.employeeId).toMatch(/^EMP-\d{4}$/);
  });

  test('employee cannot create employees (403)', async () => {
    const res = await request(app).post('/api/employees').set(auth(empToken))
      .send({ firstName: 'X', lastName: 'Y', email: 'x@test.com' });
    expect(res.status).toBe(403);
  });

  test('employee cannot list all employees (403) but admin can', async () => {
    expect((await request(app).get('/api/employees').set(auth(empToken))).status).toBe(403);
    const res = await request(app).get('/api/employees').set(auth(adminToken));
    expect(res.status).toBe(200);
    expect(res.body.pagination.total).toBeGreaterThanOrEqual(2);
  });

  test('unauthenticated request is rejected (401)', async () => {
    expect((await request(app).get('/api/employees')).status).toBe(401);
  });

  test('search and pagination work', async () => {
    const res = await request(app).get('/api/employees?search=eve&limit=5').set(auth(adminToken));
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].firstName).toBe('Eve');
  });

  test('employee can view and edit own phone but not salary', async () => {
    const res = await request(app).put(`/api/employees/${empRecordId}`).set(auth(empToken))
      .send({ phone: '12345', salary: 999999 });
    expect(res.status).toBe(200);
    expect(res.body.data.phone).toBe('12345');
    expect(res.body.data.salary).toBe(0);
  });

  test("employee cannot view another employee's record", async () => {
    const adminMe = await request(app).get('/api/employees/me').set(auth(adminToken));
    const res = await request(app).get(`/api/employees/${adminMe.body.data._id}`).set(auth(empToken));
    expect(res.status).toBe(403);
  });

  test('admin can update any employee', async () => {
    const res = await request(app).put(`/api/employees/${empRecordId}`).set(auth(adminToken))
      .send({ designation: 'Senior Staff', salary: 7000 });
    expect(res.status).toBe(200);
    expect(res.body.data.salary).toBe(7000);
  });

  test('soft delete marks inactive and blocks login', async () => {
    const del = await request(app).delete(`/api/employees/${empRecordId}`).set(auth(adminToken));
    expect(del.status).toBe(200);
    const emp = await Employee.findById(empRecordId);
    expect(emp.status).toBe('inactive');
    const login = await request(app).post('/api/auth/login').send({ email: 'eve@test.com', password: 'Passw0rd123' });
    expect(login.status).toBe(403);
  });

  test('invalid id returns 400', async () => {
    const res = await request(app).get('/api/employees/not-an-id').set(auth(adminToken));
    expect(res.status).toBe(400);
  });
});

describe('Departments and dashboard', () => {
  test('admin creates a department; employee cannot', async () => {
    expect((await request(app).post('/api/departments').set(auth(adminToken)).send({ name: 'IT' })).status).toBe(201);
    expect((await request(app).post('/api/departments').set(auth(empToken)).send({ name: 'HR' })).status).toBe(403);
  });

  test('department in use cannot be deleted', async () => {
    const dept = await request(app).post('/api/departments').set(auth(adminToken)).send({ name: 'Ops' });
    await request(app).put(`/api/employees/${empRecordId}`).set(auth(adminToken)).send({ department: dept.body.data._id });
    const res = await request(app).delete(`/api/departments/${dept.body.data._id}`).set(auth(adminToken));
    expect(res.status).toBe(409);
  });

  test('dashboard stats are admin-only and well-formed', async () => {
    expect((await request(app).get('/api/dashboard/stats').set(auth(empToken))).status).toBe(403);
    const res = await request(app).get('/api/dashboard/stats').set(auth(adminToken));
    expect(res.status).toBe(200);
    expect(res.body.data.totals.total).toBeGreaterThanOrEqual(2);
    expect(res.body.data.hiresPerMonth).toHaveLength(6);
  });
});
