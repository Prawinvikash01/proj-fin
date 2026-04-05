const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  name: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, enum: ['HR', 'Legal', 'Other'], default: 'Other' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', documentSchema);
