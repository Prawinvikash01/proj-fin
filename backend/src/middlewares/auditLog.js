const AuditLog = require('../models/AuditLog');

module.exports = (action) => async (req, res, next) => {
  res.on('finish', async () => {
    if (['POST', 'PUT', 'DELETE'].includes(req.method) && req.user) {
      await AuditLog.create({
        user: req.user.id,
        action,
        details: {
          method: req.method,
          url: req.originalUrl,
          body: req.body,
          status: res.statusCode
        }
      });
    }
  });
  next();
};
