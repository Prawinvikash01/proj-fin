const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const User = require('../models/User');

exports.applyLeave = async (req, res, next) => {
  try {
    const { type, startDate, endDate, reason } = req.body;
    console.log('Received leave application:', req.user)// Debug log
    const employeeId = req.user.id;
    // const user = await Employee.findById(employeeId);
    // Debug log
     // Assume JWT contains employee's user id
    const employee = await Employee.findOne({ user: employeeId })
  .populate("user");
    console.log('Employee found for leave application:', employee.user.name) 
    if (!employee) return res.status(404).json({ error: 'Employee profile not found' });
    const leave = new Leave({
      employee: employee._id,
      employeeName: employee.user.name, // Store name for easier access in reports
      type,
      startDate,
      endDate,
      reason
    });
    console.log('Applying for leave:', leave);
    await leave.save();
    res.status(201).json({ message: 'Leave applied', leave });
  } catch (err) {
    next(err);
  }
};

exports.getLeaves = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ user: req.user.id });
      if (!employee) return res.status(404).json({ error: 'Employee profile not found' });
      query.employee = employee._id;
    }
    const leaves = await Leave.find(query).populate('employee');
    res.json(leaves);
  } catch (err) {
    next(err);
  }
};

exports.updateLeaveStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Leave not found' });
    leave.status = status;
    leave.reviewedBy = req.user.id;
    leave.reviewedAt = new Date();
    await leave.save();
    res.json({ message: 'Leave status updated', leave });
  } catch (err) {
    next(err);
  }
};
