const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middlewares/auth');

router.post('/check-in', auth(['employee']), attendanceController.checkIn);
router.post('/check-out', auth(['employee']), attendanceController.checkOut);
router.get('/today/status', auth(['employee']), attendanceController.getTodayStatus);
router.get('/dashboard/stats', auth(['employee']), attendanceController.getDashboardStats);
router.get('/activity/recent', auth(['employee']), attendanceController.getRecentActivity);
router.get('/', auth(['employee', 'hr', 'admin']), attendanceController.getAttendance);

module.exports = router;
