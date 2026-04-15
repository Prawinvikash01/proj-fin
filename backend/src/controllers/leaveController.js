const Leave = require('../models/Leave');
const Employee = require('../models/Employee');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

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
    const leave = await Leave.findById(req.params.id).populate({ path: 'employee', populate: { path: 'user', select: 'name email' } });
    if (!leave) return res.status(404).json({ error: 'Leave not found' });
    leave.status = status;
    leave.reviewedBy = req.user.id;
    leave.reviewedAt = new Date();
    await leave.save();

    if (leave.employee?.user) {
      await createNotification(
        leave.employee.user,
        `Your leave request has been ${status}.`,
        'leave'
      );
    }

    res.json({ message: 'Leave status updated', leave });
  } catch (err) {
    next(err);
  }
};

exports.getLeaveBalance = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) return res.status(404).json({ error: 'Employee profile not found' });

    // Get all leaves for the employee
    const leaves = await Leave.find({ employee: employee._id });

    // Calculate used and pending days
    let usedDays = 0;
    let pendingDays = 0;

    leaves.forEach((leave) => {
      const days = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;
      if (leave.status === 'approved') {
        usedDays += days;
      } else if (leave.status === 'pending') {
        pendingDays += days;
      }
    });

    // Get leave balance from employee record
    const balance = {
      sick: employee.leaveBalance.sickLeave,
      vacation: employee.leaveBalance.vacationLeave,
      personal: employee.leaveBalance.personalLeave,
      used: usedDays,
      pending: pendingDays
    };

    res.json(balance);
  } catch (err) {
    next(err);
  }
};
