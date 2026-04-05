const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middlewares/auth');

// HR/admin upload document
router.post('/', auth(['hr', 'admin']), documentController.uploadDocument);
// Get documents (employee sees own, HR/admin see all)
router.get('/', auth(['employee', 'hr', 'admin']), documentController.getDocuments);
// Delete document
router.delete('/:id', auth(['hr', 'admin']), documentController.deleteDocument);

module.exports = router;
