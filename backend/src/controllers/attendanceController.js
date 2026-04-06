const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

const HOURS_FOR_PRESENT = 8; // 8 hours required to mark as present
const LATE_THRESHOLD = 30; // 30 minutes after 9 AM

exports.checkIn = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) return res.status(404).json({ error: 'Employee profile not found' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let attendance = await Attendance.findOne({ employee: employee._id, date: today });
    
    // If attendance exists and not checked out yet, prevent check-in again
    if (attendance && !attendance.checkOut) {
      return res.status(400).json({ error: 'Already checked in today. Please check out first.' });
    }
    
    // If attendance exists and already checked out, allow new attendance record for next shift
    if (!attendance) {
      attendance = new Attendance({ employee: employee._id, date: today, checkIn: new Date() });
    } else {
      // Reset for new shift
      attendance.checkIn = new Date();
      attendance.checkOut = null;
      attendance.status = 'present';
    }
    
    // Check if late (after 9:30 AM)
    const checkInTime = new Date();
    const checkInHour = checkInTime.getHours();
    const checkInMinutes = checkInTime.getMinutes();
    
    if (checkInHour >= 9 && checkInMinutes > LATE_THRESHOLD) {
      attendance.status = 'late';
    }
    
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
    today.setHours(0, 0, 0, 0);
    
    let attendance = await Attendance.findOne({ employee: employee._id, date: today });
    if (!attendance) return res.status(400).json({ error: 'Not checked in yet' });
    if (attendance.checkOut) return res.status(400).json({ error: 'Already checked out today' });
    
    attendance.checkOut = new Date();
    
    // Calculate hours worked
    const hours = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
    
    // Mark as present only if 8+ hours worked
    if (hours >= HOURS_FOR_PRESENT) {
      attendance.status = attendance.status === 'late' ? 'late' : 'present';
    } else {
      attendance.status = 'absent'; // Less than 8 hours = not present
    }
    
    await attendance.save();
    res.json({ message: 'Checked out', attendance, hoursWorked: hours.toFixed(2) });
  } catch (err) {
    next(err);
  }
};

exports.getTodayStatus = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) return res.status(404).json({ error: 'Employee profile not found' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({ employee: employee._id, date: today });
    
    const status = {
      isCheckedIn: false,
      isCheckedOut: false,
      status: 'checked-out',
      checkInTime: null,
      checkOutTime: null,
      hoursWorked: 0
    };
    
    if (attendance) {
      if (attendance.checkIn) status.isCheckedIn = true;
      if (attendance.checkOut) {
        status.isCheckedOut = true;
        status.status = 'checked-out';
        status.hoursWorked = ((attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60)).toFixed(2);
      } else {
        status.status = 'checked-in';
      }
      status.checkInTime = attendance.checkIn;
      status.checkOutTime = attendance.checkOut;
    }
    
    res.json(status);
  } catch (err) {
    next(err);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) return res.status(404).json({ error: 'Employee profile not found' });
    
    // Get last 30 days attendance
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);
    
    const records = await Attendance.find({
      employee: employee._id,
      date: { $gte: thirtyDaysAgo }
    });
    
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    
    res.json({
      presentDays: present,
      absentDays: absent,
      lateDays: late,
      totalDays: records.length
    });
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

    // Date filter
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
      populate: { path: 'user', select: 'name email' }
    });

    res.json(records);
  } catch (err) {
    next(err);
  }
};
