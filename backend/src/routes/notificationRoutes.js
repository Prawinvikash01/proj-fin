const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');

router.get('/', auth(), notificationController.getNotifications);
router.post('/read', auth(), notificationController.markAsRead);
router.put('/:id/read', auth(), notificationController.markNotificationAsRead);

module.exports = router;
