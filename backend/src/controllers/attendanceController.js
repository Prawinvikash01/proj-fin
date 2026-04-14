const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

const IST_OFFSET_MINUTES = 330; // IST is UTC+5:30
const FULL_DAY_HOURS = 8;
const HALF_DAY_HOURS = 4;

const toIstDate = (date = new Date()) => {
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utcTime + IST_OFFSET_MINUTES * 60000);
};

const getIstDayRange = (date = new Date()) => {
  const ist = toIstDate(date);
  const year = ist.getUTCFullYear();
  const month = ist.getUTCMonth();
  const day = ist.getUTCDate();

  const start = new Date(Date.UTC(year, month, day, 0, 0, 0));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
};

const parseIstDateString = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
};

const createAttendanceStatus = (checkInTime) => {
  const istCheckIn = toIstDate(checkInTime);
  const hours = istCheckIn.getUTCHours();
  const minutes = istCheckIn.getUTCMinutes();

  if (hours < 9 || (hours === 9 && minutes <= 15)) {
    return 'present';
  }
  return 'late';
};

const determineCheckoutStatus = (attendance, checkOutTime) => {
  const hoursWorked = (checkOutTime - attendance.checkIn) / (1000 * 60 * 60);
  const wasLate = attendance.status === 'late';

  if (hoursWorked >= FULL_DAY_HOURS) {
    return wasLate ? 'late' : 'full-day';
  }
  if (hoursWorked >= HALF_DAY_HOURS) {
    return wasLate ? 'late' : 'half-day';
  }
  return 'absent';
};

exports.checkIn = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) return res.status(404).json({ error: 'Employee profile not found' });

    const now = new Date();
    const { start } = getIstDayRange(now);

    const existingAttendance = await Attendance.findOne({
      employee: employee._id,
      date: start
    });

    if (existingAttendance) {
      return res.status(400).json({ error: 'Already checked in today. Multiple check-ins are not allowed.' });
    }

    const attendance = new Attendance({
      employee: employee._id,
      date: start,
      checkIn: now,
      status: createAttendanceStatus(now)
    });

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

    const now = new Date();
    const { start } = getIstDayRange(now);

    const attendance = await Attendance.findOne({
      employee: employee._id,
      date: start
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ error: 'Cannot check out without a valid check-in.' });
    }
    if (attendance.checkOut) {
      return res.status(400).json({ error: 'Already checked out today.' });
    }

    attendance.checkOut = now;
    attendance.status = determineCheckoutStatus(attendance, now);

    const hoursWorked = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);

    await attendance.save();
    res.json({ message: 'Checked out', attendance, hoursWorked: Number(hoursWorked.toFixed(2)) });
  } catch (err) {
    next(err);
  }
};

exports.getTodayStatus = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) return res.status(404).json({ error: 'Employee profile not found' });

    const { start } = getIstDayRange(new Date());
    const attendance = await Attendance.findOne({ employee: employee._id, date: start });

    const status = {
      isCheckedIn: false,
      isCheckedOut: false,
      status: 'checked-out',
      attendanceStatus: 'absent',
      checkInTime: null,
      checkOutTime: null,
      hoursWorked: 0
    };

    if (attendance) {
      status.attendanceStatus = attendance.status;
      if (attendance.checkIn) {
        status.isCheckedIn = true;
      }
      if (attendance.checkOut) {
        status.isCheckedOut = true;
        status.status = 'checked-out';
        status.hoursWorked = Number(((attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60)).toFixed(2));
      } else if (attendance.checkIn) {
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
    
    // Get last 30 days attendance using IST-aligned dates
    const todayIst = getIstDayRange(new Date()).end;
    const thirtyDaysAgo = new Date(todayIst.getTime() - 30 * 24 * 60 * 60 * 1000);

    const records = await Attendance.find({
      employee: employee._id,
      date: { $gte: thirtyDaysAgo, $lt: todayIst }
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

    // Date filter (IST-based date selection)
    if (req.query.date) {
      const selectedDate = parseIstDateString(req.query.date);
      const nextDay = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);

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

exports.getRecentActivity = async (req, res, next) => {
  try {
    const AuditLog = require('../models/AuditLog');
    
    // Get employee's recent activities from logs (last 10 days)
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    
    const activities = await AuditLog.find({
      user: req.user.id,
      createdAt: { $gte: tenDaysAgo }
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Format activities for display
    const formattedActivities = activities.map((log) => {
      // Create human-readable descriptions
      let description = '';
      const methodUrl = log.details?.url || '';
      const method = log.details?.method || '';
      
      if (method === 'POST' && methodUrl.includes('attachment')) {
        description = 'Uploaded a document';
      } else if (method === 'POST' && methodUrl.includes('leave')) {
        description = 'Submitted leave request';
      } else if (method === 'POST' && methodUrl.includes('check-in')) {
        description = 'Checked in';
      } else if (method === 'POST' && methodUrl.includes('check-out')) {
        description = 'Checked out';
      } else if (method === 'PUT' && methodUrl.includes('profile')) {
        description = 'Updated profile';
      } else if (method === 'PUT' && methodUrl.includes('task')) {
        description = 'Completed a task';
      } else {
        description = log.action || 'System activity';
      }
      
      return {
        id: log._id,
        description,
        timestamp: log.createdAt,
        action: log.action
      };
    });
    
    res.json(formattedActivities);
  } catch (err) {
    next(err);
  }
};
