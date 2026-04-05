const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middlewares/auth');

// Only admin/hr can manage employees
router.post('/', auth(['admin', 'hr']), employeeController.createEmployee);
router.get('/', auth(['admin', 'hr']), employeeController.getEmployees);
router.get('/:id', auth(['admin', 'hr']), employeeController.getEmployee);
router.put('/:id', auth(['admin', 'hr']), employeeController.updateEmployee);
router.delete('/:id', auth(['admin', 'hr']), employeeController.deleteEmployee);

module.exports = router;
