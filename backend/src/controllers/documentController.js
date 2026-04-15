const mongoose = require('mongoose');
const Document = require('../models/Document');
const Employee = require('../models/Employee');
const { createNotification } = require('./notificationController');

exports.uploadDocument = async (req, res, next) => {
  try {
    const { employeeId, name, url, category } = req.body;
    const documentData = { name, url, category, uploadedBy: req.user.id };

    let employee = null;
    if (employeeId) {
      if (!mongoose.isValidObjectId(employeeId)) {
        return res.status(400).json({ error: 'Invalid employee selected' });
      }
      employee = await Employee.findById(employeeId).populate('user', 'name email');
      if (!employee) return res.status(404).json({ error: 'Employee not found' });
      documentData.employee = employeeId;
    }

    const document = new Document(documentData);
    await document.save();

    const populatedDocument = await Document.findById(document._id)
      .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } })
      .populate('uploadedBy', 'name email');

    if (employee?.user) {
      await createNotification(
        employee.user,
        `A new document (${name}) has been uploaded for you.`,
        'general'
      );
    }

    res.status(201).json({ message: 'Document uploaded', document: populatedDocument });
  } catch (err) {
    next(err);
  }
};

exports.getDocuments = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'employee') {
      const employee = await Employee.findOne({ user: req.user.id });
      if (!employee) return res.status(404).json({ error: 'Employee profile not found' });
      query = {
        $or: [
          { employee: employee._id },
          { employee: { $exists: false } },
          { employee: null },
        ],
      };
    }
    const docs = await Document.find(query)
      .populate({ path: 'employee', populate: { path: 'user', select: 'name email' } })
      .populate('uploadedBy', 'name email');
    res.json(docs);
  } catch (err) {
    next(err);
  }
};

exports.deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ error: 'Document not found' });
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Document deleted' });
  } catch (err) {
    next(err);
  }
};
