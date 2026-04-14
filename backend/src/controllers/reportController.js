const Employee = require('../models/Employee');
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');
const Payroll = require('../models/Payroll');

exports.employeeStats = async (req, res, next) => {
  try {
    const total = await Employee.countDocuments();
    const active = await Employee.countDocuments({ status: 'active' });
    const inactive = await Employee.countDocuments({ status: 'inactive' });
    const terminated = await Employee.countDocuments({ status: 'terminated' });
    res.json({ total, active, inactive, terminated });
  } catch (err) {
    next(err);
  }
};

exports.dashboardOverview = async (req, res, next) => {
  try {
    const total = await Employee.countDocuments();
    const active = await Employee.countDocuments({ status: 'active' });
    const inactive = await Employee.countDocuments({ status: 'inactive' });
    const terminated = await Employee.countDocuments({ status: 'terminated' });
    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });

    const recentLeaves = await Leave.find()
      .sort({ appliedAt: -1 })
      .limit(3)
      .populate({
        path: 'employee',
        select: 'user',
        populate: { path: 'user', select: 'name' }
      });

    const recentCheckIns = await Attendance.find({ checkIn: { $exists: true } })
      .sort({ date: -1, checkIn: -1 })
      .limit(3)
      .populate({
        path: 'employee',
        select: 'user',
        populate: { path: 'user', select: 'name' }
      });

    const formattedRecentLeaves = recentLeaves.map((leave) => ({
      id: leave._id,
      employeeName: leave.employee?.user?.name || leave.employeeName || 'Unknown',
      type: leave.type,
      status: leave.status,
    }));

    const formattedRecentCheckIns = recentCheckIns.map((record) => ({
      id: record._id,
      employeeName: record.employee?.user?.name || 'Unknown',
      checkIn: record.checkIn,
    }));

    res.json({
      stats: { total, active, inactive, terminated, pendingLeaves },
      recentLeaves: formattedRecentLeaves,
      recentCheckIns: formattedRecentCheckIns,
    });
  } catch (err) {
    next(err);
  }
};

exports.leaveReport = async (req, res, next) => {
  try {
    const leaves = await Leave.find().populate('employee');
    res.json(leaves);
  } catch (err) {
    next(err);
  }
};

exports.attendanceReport = async (req, res, next) => {
  try {
    const records = await Attendance.find().populate('employee');
    res.json(records);
  } catch (err) {
    next(err);
  }
};

exports.payrollReport = async (req, res, next) => {
  try {
    const payrolls = await Payroll.find().populate('employee');
    res.json(payrolls);
  } catch (err) {
    next(err);
  }
};
