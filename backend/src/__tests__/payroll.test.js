const request = require('supertest');
const app = require('../app');

describe('Payroll API', () => {
  it('should allow HR to create and retrieve payrolls', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'HR', email: 'payroll-hr@conexra.test', password: 'Password123', role: 'hr' });

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'payroll-hr@conexra.test', password: 'Password123' });

    const token = login.body.token;

    const createEmp = await request(app)
      .post('/api/employees')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Payroll Test',
        email: 'payroll-employee@conexra.test',
        password: 'Password123',
        role: 'employee',
        position: 'Tester',
        department: 'Finance',
        phone: '5555555555',
        address: '123 Payroll St'
      });
    const employeeId = createEmp.body.employee._id;

    const create = await request(app)
      .post('/api/payrolls')
      .set('Authorization', `Bearer ${token}`)
      .send({ employeeId, salary: 5000, month: '2026-04', bonuses: 300, deductions: 50 });

    expect(create.statusCode).toBe(201);
    expect(create.body).toHaveProperty('payroll');

    const list = await request(app)
      .get('/api/payrolls')
      .set('Authorization', `Bearer ${token}`);

    expect(list.statusCode).toBe(200);
    expect(list.body.length).toBeGreaterThanOrEqual(1);
  });
});