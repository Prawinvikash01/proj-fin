const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const auth = require('../middlewares/auth');

// Employee applies for leave
router.post('/', auth(['employee']), leaveController.applyLeave);
// Get leaves (employee sees own, HR/admin see all)
router.get('/', auth(['employee', 'hr', 'admin']), leaveController.getLeaves);
// Get leave balance for logged-in employee
router.get('/balance', auth(['employee']), leaveController.getLeaveBalance);
// HR/admin approve/reject
router.put('/:id/status', auth(['hr', 'admin']), leaveController.updateLeaveStatus);

module.exports = router;
