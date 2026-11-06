const authService = require('../services/authService');
const Employee = require('../models/Employee');
const asyncHandler = require('../utils/asyncHandler');

exports.register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const result = await authService.register({ firstName, lastName, email, password });
  res.status(201).json({ success: true, data: result, message: 'Registration successful' });
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ success: true, data: result });
});

exports.me = asyncHandler(async (req, res) => {
  const employee = req.user.employee ? await Employee.findById(req.user.employee).populate('department', 'name') : null;
  res.json({ success: true, data: { user: req.user, employee } });
});
