let settings = {
  companyName: 'Conexra',
  leaveTypes: ['Annual', 'Sick', 'Maternity', 'Paternity'],
  holidays: [],
  email: '',
  branding: {}
};

exports.getSettings = (req, res) => {
  res.json(settings);
};

exports.updateSettings = (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
};
