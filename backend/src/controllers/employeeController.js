const Employee = require('../models/Employee');
const User = require('../models/User');

exports.createEmployee = async (req, res, next) => {
  try {
    const { name, email, password, role, position, department, dateOfJoining, phone, address } = req.body;
    // Create user
    const user = new User({ name, email, password, role });
    await user.save();
    // Create employee profile
    const employee = new Employee({
      user: user._id,
      position,
      department,
      dateOfJoining,
      phone,
      address
    });
    await employee.save();
    res.status(201).json({ message: 'Employee created', employee });
  } catch (err) {
    next(err);
  }
};

exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().populate('user', 'name email role status');
    res.json(employees);
  } catch (err) {
    next(err);
  }
};

exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id).populate('user', 'name email role status');
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const { position, department, dateOfJoining, phone, address, city, country, status } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { position, department, dateOfJoining, phone, address, city, country, status },
      { new: true }
    );
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    // Optionally delete user as well
    await User.findByIdAndDelete(employee.user);
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    next(err);
  }
};
