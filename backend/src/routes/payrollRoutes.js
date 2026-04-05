const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');
const auth = require('../middlewares/auth');

// HR/admin create payroll
router.post('/', auth(['hr', 'admin']), payrollController.createPayroll);
// Get payrolls (employee sees own, HR/admin see all)
router.get('/', auth(['employee', 'hr', 'admin']), payrollController.getPayrolls);
// HR/admin update payroll
router.put('/:id', auth(['hr', 'admin']), payrollController.updatePayroll);
// HR/admin delete payroll
router.delete('/:id', auth(['hr', 'admin']), payrollController.deletePayroll);

module.exports = router;
