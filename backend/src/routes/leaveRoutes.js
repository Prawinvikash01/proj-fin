const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const auth = require('../middlewares/auth');

// More specific routes first
router.get('/balance', auth(['employee']), leaveController.getLeaveBalance);

// Then general routes
router.post('/', auth(['employee']), leaveController.applyLeave);
router.get('/', auth(['employee', 'hr', 'admin']), leaveController.getLeaves);
router.put('/:id/status', auth(['hr', 'admin']), leaveController.updateLeaveStatus);

module.exports = router;
