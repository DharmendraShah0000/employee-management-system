const Employee = require('../models/Employee');
const User = require('../models/User');
const Counter = require('../models/Counter');
const ApiError = require('../utils/ApiError');

const ADMIN_FIELDS = ['firstName', 'lastName', 'email', 'phone', 'address', 'department', 'designation', 'salary', 'joiningDate', 'status'];
const SELF_FIELDS = ['phone', 'address'];

const pick = (obj, fields) =>
  fields.reduce((acc, f) => (obj[f] !== undefined ? { ...acc, [f]: obj[f] === '' && f === 'department' ? null : obj[f] } : acc), {});

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.nextEmployeeId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { _id: 'employeeId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `EMP-${String(counter.seq).padStart(4, '0')}`;
};

exports.list = async ({ page = 1, limit = 10, search, department, status, sort = '-createdAt' }) => {
  page = Math.max(parseInt(page, 10) || 1, 1);
  limit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const filter = {};
  if (status) filter.status = status;
  if (department) filter.department = department;
  if (search) {
    const rx = new RegExp(escapeRegex(search.trim()), 'i');
    filter.$or = [{ firstName: rx }, { lastName: rx }, { email: rx }, { employeeId: rx }, { designation: rx }];
  }

  const allowedSort = ['createdAt', 'firstName', 'lastName', 'salary', 'joiningDate', 'employeeId'];
  const sortKey = sort.replace(/^-/, '');
  const sortBy = allowedSort.includes(sortKey) ? sort : '-createdAt';

  const [data, total] = await Promise.all([
    Employee.find(filter).populate('department', 'name').sort(sortBy).skip((page - 1) * limit).limit(limit),
    Employee.countDocuments(filter),
  ]);

  return { data, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 } };
};

exports.getById = async (id) => {
  const employee = await Employee.findById(id).populate('department', 'name');
  if (!employee) throw new ApiError(404, 'Employee not found');
  return employee;
};

exports.create = async (payload) => {
  const { password, ...rest } = payload;
  if (await User.findOne({ email: rest.email })) throw new ApiError(409, 'Email already registered');

  const employee = await Employee.create({ ...pick(rest, ADMIN_FIELDS), employeeId: await exports.nextEmployeeId() });

  // Optional login account for the new employee (always role=employee)
  if (password) {
    try {
      await User.create({ email: employee.email, password, role: 'employee', employee: employee._id });
    } catch (err) {
      await Employee.findByIdAndDelete(employee._id);
      throw err;
    }
  }
  return employee.populate('department', 'name');
};

exports.update = async (id, payload, requester) => {
  const isAdmin = requester.role === 'admin';
  const isOwner = requester.employee && String(requester.employee) === String(id);
  if (!isAdmin && !isOwner) throw new ApiError(403, 'You can only update your own profile');

  const updates = pick(payload, isAdmin ? ADMIN_FIELDS : SELF_FIELDS);
  const employee = await Employee.findById(id);
  if (!employee) throw new ApiError(404, 'Employee not found');

  Object.assign(employee, updates);
  await employee.save();

  // Keep the linked login account in sync
  const linked = await User.findOne({ employee: employee._id });
  if (linked && isAdmin) {
    if (updates.email) linked.email = updates.email;
    if (updates.status) linked.isActive = updates.status === 'active';
    await linked.save();
  }
  return employee.populate('department', 'name');
};

// Soft delete: keep the record, mark inactive, and block login
exports.remove = async (id, requester) => {
  const employee = await Employee.findById(id);
  if (!employee) throw new ApiError(404, 'Employee not found');
  if (requester.employee && String(requester.employee) === String(id)) {
    throw new ApiError(400, 'You cannot deactivate your own account');
  }
  employee.status = 'inactive';
  await employee.save();
  await User.updateMany({ employee: employee._id }, { isActive: false });
  return employee;
};
