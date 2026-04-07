const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');

exports.createPayroll = async (req, res, next) => {
  try {
    const { employeeId, salary, bonuses, deductions, month, payslipUrl } = req.body;
    if (!employeeId || !salary || !month) {
      return res.status(400).json({ error: 'employeeId, salary, and month are required' });
    }
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    const payroll = new Payroll({
      employee: employeeId,
      salary,
      bonuses,
      deductions,
      month,
      payslipUrl
    });
    await payroll.save();
    const populatedPayroll = await payroll.populate('employee');
    res.status(201).json({ message: 'Payroll created', payroll: populatedPayroll });
  } catch (err) {
    next(err);
  }
};

exports.getPayrolls = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ user: req.user.id });
      if (!employee) return res.status(404).json({ error: 'Employee profile not found' });
      query.employee = employee._id;
    }
    const payrolls = await Payroll.find(query).populate('employee');
    res.json(payrolls);
  } catch (err) {
    next(err);
  }
};

exports.updatePayroll = async (req, res, next) => {
  try {
    const { employeeId, salary, bonuses, deductions, month, payslipUrl } = req.body;
    const payload = req.body;

    if (employeeId) {
      const employee = await Employee.findById(employeeId);
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
    }

    const payroll = await Payroll.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!payroll) return res.status(404).json({ error: 'Payroll entry not found' });
    const populatedPayroll = await payroll.populate('employee');
    res.json(populatedPayroll);
  } catch (err) {
    next(err);
  }
};

exports.deletePayroll = async (req, res, next) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id);
    if (!payroll) return res.status(404).json({ error: 'Payroll entry not found' });
    res.json({ message: 'Payroll deleted' });
  } catch (err) {
    next(err);
  }
};
