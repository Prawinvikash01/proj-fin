const request = require('supertest');
const app = require('../app');

const createAdminAndToken = async () => {
  await request(app)
    .post('/api/auth/register')
    .send({ name: 'HR Manager', email: 'hr@conexra.test', password: 'Password123', role: 'hr' });

  const login = await request(app)
    .post('/api/auth/login')
    .send({ email: 'hr@conexra.test', password: 'Password123' });

  return login.body.token;
};

describe('Employee API', () => {
  it('should perform CRUD operations for employee', async () => {
    const token = await createAdminAndToken();

    const createRes = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'John Doe',
        email: 'johndoe@conexra.test',
        password: 'secret123',
        role: 'employee',
        position: 'Developer',
        department: 'Engineering',
        phone: '1234567890',
        address: '123 Main St'
      });

    expect(createRes.statusCode).toBe(201);
    expect(createRes.body).toHaveProperty('employee');

    const empId = createRes.body.employee._id;

    const getRes = await request(app)
      .get('/api/employees')
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.length).toBeGreaterThanOrEqual(1);

    const employeeRes = await request(app)
      .get(`/api/employees/${empId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(employeeRes.statusCode).toBe(200);
    expect(employeeRes.body).toHaveProperty('position', 'Developer');

    const updateRes = await request(app)
      .put(`/api/employees/${empId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ department: 'Product', position: 'Product Manager', status: 'active' });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty('department', 'Product');

    const deleteRes = await request(app)
      .delete(`/api/employees/${empId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toHaveProperty('message', 'Employee deleted');
  });

  it('should reject non-admin/hr users for employee create', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Normal User', email: 'user@conexra.test', password: 'Password123', role: 'employee' });

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@conexra.test', password: 'Password123' });

    const res = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({ name: 'Will fail', email: 'fail@conexra.test', password: 'x', role: 'employee' });

    expect(res.statusCode).toBe(403);
    expect(res.body).toHaveProperty('error', 'Forbidden');
  });
});