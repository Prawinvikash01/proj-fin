const mongoose = require('mongoose');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');
const Payroll = require('../models/Payroll');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  await mongoose.connect(MONGO_URI);
  await User.deleteMany({});
  await Employee.deleteMany({});
  await Leave.deleteMany({});
  await Attendance.deleteMany({});
  await Payroll.deleteMany({});

  const admin = new User({ name: 'Admin', email: 'admin@conexra.com', password: 'admin123', role: 'admin' });
  await admin.save();
  const hr = new User({ name: 'HR', email: 'hr@conexra.com', password: 'hr123', role: 'hr' });
  await hr.save();
  const emp = new User({ name: 'Employee', email: 'emp@conexra.com', password: 'emp123', role: 'employee' });
  await emp.save();

  const empProfile = new Employee({ user: emp._id, position: 'Developer', department: 'IT', phone: '1234567890', address: '123 Main St' });
  await empProfile.save();

  await mongoose.disconnect();
  console.log('Demo data seeded!');
}

seed();
