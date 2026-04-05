const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const auth = require('../middlewares/auth');

// Only admin/hr can view audit logs
router.get('/', auth(['admin', 'hr']), async (req, res, next) => {
  try {
    const logs = await AuditLog.find().populate('user', 'name email role').sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
