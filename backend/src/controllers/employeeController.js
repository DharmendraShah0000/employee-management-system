const employeeService = require('../services/employeeService');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  const { data, pagination } = await employeeService.list(req.query);
  res.json({ success: true, data, pagination });
});

exports.me = asyncHandler(async (req, res) => {
  if (!req.user.employee) throw new ApiError(404, 'No employee record linked to this account');
  res.json({ success: true, data: await employeeService.getById(req.user.employee) });
});

exports.getOne = asyncHandler(async (req, res) => {
  const { user } = req;
  const isOwner = user.employee && String(user.employee) === req.params.id;
  if (user.role !== 'admin' && !isOwner) throw new ApiError(403, 'You can only view your own record');
  res.json({ success: true, data: await employeeService.getById(req.params.id) });
});

exports.create = asyncHandler(async (req, res) => {
  const employee = await employeeService.create(req.body);
  res.status(201).json({ success: true, data: employee, message: 'Employee created' });
});

exports.update = asyncHandler(async (req, res) => {
  const employee = await employeeService.update(req.params.id, req.body, req.user);
  res.json({ success: true, data: employee, message: 'Employee updated' });
});

exports.remove = asyncHandler(async (req, res) => {
  await employeeService.remove(req.params.id, req.user);
  res.json({ success: true, message: 'Employee deactivated' });
});
