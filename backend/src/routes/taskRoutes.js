const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/auth');

// Admin routes (for managing all tasks)
router.get('/admin/all', auth(['admin', 'hr']), taskController.getAllTasksAdmin);
router.get('/admin/stats', auth(['admin', 'hr']), taskController.getTaskStatsAdmin);

// Employee routes (for own tasks)
router.get('/pending', auth(['employee']), taskController.getPendingTasks);
router.get('/all', auth(['employee']), taskController.getAllTasks);
router.get('/stats', auth(['employee']), taskController.getTaskStats);

// CRUD routes (admin/hr create, anyone update own status)
router.post('/', auth(['admin', 'hr']), taskController.createTask);
router.put('/:taskId', auth(['admin', 'hr']), taskController.updateTask);
router.put('/:taskId/status', auth(['employee', 'admin', 'hr']), taskController.updateTaskStatus);
router.delete('/:taskId', auth(['admin', 'hr']), taskController.deleteTask);

module.exports = router;
