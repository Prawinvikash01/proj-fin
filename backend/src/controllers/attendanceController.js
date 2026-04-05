const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

exports.checkIn = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) return res.status(404).json({ error: 'Employee profile not found' });
    const today = new Date();
    today.setHours(0,0,0,0);
    let attendance = await Attendance.findOne({ employee: employee._id, date: today });
    if (attendance) return res.status(400).json({ error: 'Already checked in today' });
    attendance = new Attendance({ employee: employee._id, date: today, checkIn: new Date() });
    await attendance.save();
    res.status(201).json({ message: 'Checked in', attendance });
  } catch (err) {
    next(err);
  }
};

exports.checkOut = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) return res.status(404).json({ error: 'Employee profile not found' });
    const today = new Date();
    today.setHours(0,0,0,0);
    let attendance = await Attendance.findOne({ employee: employee._id, date: today });
    if (!attendance) return res.status(400).json({ error: 'Not checked in yet' });
    if (attendance.checkOut) return res.status(400).json({ error: 'Already checked out today' });
    attendance.checkOut = new Date();
    await attendance.save();
    res.json({ message: 'Checked out', attendance });
  } catch (err) {
    next(err);
  }
};
exports.getAttendance = async (req, res, next) => {
  try {
    let query = {};

    // Role-based filter
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ user: req.user.id });
      if (!employee) return res.status(404).json({ error: 'Employee profile not found' });
      query.employee = employee._id;
    }

    // ✅ Date filter (THIS IS MISSING)
    if (req.query.date) {
      const selectedDate = new Date(req.query.date);
      selectedDate.setHours(0, 0, 0, 0);

      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);

      query.date = {
        $gte: selectedDate,
        $lt: nextDay
      };
    }

    const records = await Attendance.find(query).populate({
      path: 'employee',
      populate: { path: 'user', select: 'name email' } // ✅ better data
    });

    res.json(records);
  } catch (err) {
    next(err);
  }
};
