const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.get('/me', auth(), authController.getCurrentUser);
router.put('/me', auth(), authController.updateCurrentUser);
router.put('/change-password', auth(), authController.changePassword);

module.exports = router;
