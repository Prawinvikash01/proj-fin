const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  position: { type: String, required: true },
  department: { type: String },
  dateOfJoining: { type: Date },
  phone: { type: String },
  address: { type: String },
  documents: [{
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  leaveBalance: {
    sickLeave: { type: Number, default: 12 },
    vacationLeave: { type: Number, default: 15 },
    personalLeave: { type: Number, default: 5 }
  },
  status: { type: String, enum: ['active', 'inactive', 'terminated'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', employeeSchema);
