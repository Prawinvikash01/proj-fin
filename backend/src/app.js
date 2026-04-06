require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const employeeRoutes = require('./routes/employeeRoutes');
app.use('/api/employees', employeeRoutes);
const leaveRoutes = require('./routes/leaveRoutes');
app.use('/api/leaves', leaveRoutes);
const attendanceRoutes = require('./routes/attendanceRoutes');
app.use('/api/attendance', attendanceRoutes);
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);
const payrollRoutes = require('./routes/payrollRoutes');
app.use('/api/payrolls', payrollRoutes);
const documentRoutes = require('./routes/documentRoutes');
app.use('/api/documents', documentRoutes);
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);
const auditLogRoutes = require('./routes/auditLogRoutes');
app.use('/api/audit-logs', auditLogRoutes);
const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);
const settingsRoutes = require('./routes/settingsRoutes');
app.use('/api/settings', settingsRoutes);
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
