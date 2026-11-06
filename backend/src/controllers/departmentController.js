const Department = require('../models/Department');
const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

exports.list = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await Department.find().sort('name') });
});

exports.create = asyncHandler(async (req, res) => {
  const dept = await Department.create({ name: req.body.name, description: req.body.description });
  res.status(201).json({ success: true, data: dept });
});

exports.update = asyncHandler(async (req, res) => {
  const dept = await Department.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, description: req.body.description },
    { new: true, runValidators: true }
  );
  if (!dept) throw new ApiError(404, 'Department not found');
  res.json({ success: true, data: dept });
});

exports.remove = asyncHandler(async (req, res) => {
  if (await Employee.exists({ department: req.params.id })) {
    throw new ApiError(409, 'Department is in use by employees and cannot be deleted');
  }
  const dept = await Department.findByIdAndDelete(req.params.id);
  if (!dept) throw new ApiError(404, 'Department not found');
  res.json({ success: true, message: 'Department deleted' });
});
