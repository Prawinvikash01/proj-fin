const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middlewares/auth');

router.get('/employee-stats', auth(['admin', 'hr']), reportController.employeeStats);
router.get('/dashboard', auth(['admin', 'hr']), reportController.dashboardOverview);
router.get('/leaves', auth(['admin', 'hr']), reportController.leaveReport);
router.get('/attendance', auth(['admin', 'hr']), reportController.attendanceReport);
router.get('/payrolls', auth(['admin', 'hr']), reportController.payrollReport);

module.exports = router;
