const Task = require('../models/Task');
const Employee = require('../models/Employee');
const User = require('../models/User');

// Get all tasks for admin/hr (view all)
exports.getAllTasksAdmin = async (req, res, next) => {
  try {
    const { status, priority, employeeId } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (employeeId) {
      query.employee = employeeId;
    }

    const tasks = await Task.find(query)
      .populate({
        path: 'employee',
        populate: { path: 'user', select: 'name email' }
      })
      .populate('assignedBy', 'name email')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// Get task stats for admin (all tasks)
exports.getTaskStatsAdmin = async (req, res, next) => {
  try {
    const total = await Task.countDocuments();
    const pending = await Task.countDocuments({ status: 'pending' });
    const inProgress = await Task.countDocuments({ status: 'in-progress' });
    const completed = await Task.countDocuments({ status: 'completed' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = await Task.countDocuments({
      status: { $in: ['pending', 'in-progress'] },
      dueDate: { $lt: today }
    });

    res.json({ total, pending, inProgress, completed, overdue });
  } catch (err) {
    next(err);
  }
};

// Get pending tasks for logged-in employee
exports.getPendingTasks = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) return res.status(404).json({ error: 'Employee profile not found' });

    const tasks = await Task.find({
      employee: employee._id,
      status: { $in: ['pending', 'in-progress'] }
    })
      .populate('assignedBy', 'name email')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// Get all tasks for logged-in employee
exports.getAllTasks = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) return res.status(404).json({ error: 'Employee profile not found' });

    const tasks = await Task.find({ employee: employee._id })
      .populate('assignedBy', 'name email')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// Get task stats for dashboard
exports.getTaskStats = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ user: req.user.id });
    if (!employee) return res.status(404).json({ error: 'Employee profile not found' });

    const pending = await Task.countDocuments({
      employee: employee._id,
      status: 'pending'
    });

    const inProgress = await Task.countDocuments({
      employee: employee._id,
      status: 'in-progress'
    });

    const completed = await Task.countDocuments({
      employee: employee._id,
      status: 'completed'
    });

    res.json({
      pendingTasks: pending + inProgress,
      completedTasks: completed
    });
  } catch (err) {
    next(err);
  }
};

// Create task (admin/manager only)
exports.createTask = async (req, res, next) => {
  try {
    const { employeeId, title, description, dueDate, priority, category, status } = req.body;

    if (!employeeId) return res.status(400).json({ error: 'Employee ID required' });
    if (!title) return res.status(400).json({ error: 'Title required' });
    if (!dueDate) return res.status(400).json({ error: 'Due date required' });

    // Verify employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const task = new Task({
      employee: employeeId,
      assignedBy: req.user.id,
      title,
      description,
      dueDate,
      priority: priority || 'medium',
      category,
      status: status || 'pending'
    });

    await task.save();
    await task.populate([
      { path: 'employee', populate: { path: 'user', select: 'name email' } },
      { path: 'assignedBy', select: 'name email' }
    ]);

    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    next(err);
  }
};

// Update task (admin can update all fields)
exports.updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { title, description, employeeId, dueDate, priority, status, category } = req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // If changing employee, verify new employee exists
    if (employeeId && employeeId !== task.employee.toString()) {
      const employee = await Employee.findById(employeeId);
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
      task.employee = employeeId;
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (status) {
      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
      }
    }
    if (category) task.category = category;

    task.updatedAt = new Date();
    await task.save();
    await task.populate([
      { path: 'employee', populate: { path: 'user', select: 'name email' } },
      { path: 'assignedBy', select: 'name email' }
    ]);

    res.json({ message: 'Task updated', task });
  } catch (err) {
    next(err);
  }
};

// Update task status only
exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!['pending', 'in-progress', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.status = status;
    if (status === 'completed') {
      task.completedAt = new Date();
    }
    task.updatedAt = new Date();

    await task.save();
    res.json({ message: 'Task updated', task });
  } catch (err) {
    next(err);
  }
};

// Delete task
exports.deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);

    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json({ message: 'Task deleted', task });
  } catch (err) {
    next(err);
  }
};
