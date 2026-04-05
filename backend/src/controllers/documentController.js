const Document = require('../models/Document');
const Employee = require('../models/Employee');

exports.uploadDocument = async (req, res, next) => {
  try {
    const { employeeId, name, url, category } = req.body;
    const document = new Document({
      employee: employeeId,
      name,
      url,
      category,
      uploadedBy: req.user.id
    });
    await document.save();
    res.status(201).json({ message: 'Document uploaded', document });
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
      query.employee = employee._id;
    }
    const docs = await Document.find(query).populate('employee').populate('uploadedBy', 'name email');
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
