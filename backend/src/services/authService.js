const User = require('../models/User');
const Employee = require('../models/Employee');
const ApiError = require('../utils/ApiError');
const generateToken = require('../utils/generateToken');
const { nextEmployeeId } = require('./employeeService');

exports.register = async ({ firstName, lastName, email, password }) => {
  if (await User.findOne({ email })) throw new ApiError(409, 'Email already registered');

  // Role is NEVER taken from the request: self-registered users are always employees.
  const employee = await Employee.create({
    employeeId: await nextEmployeeId(),
    firstName,
    lastName,
    email,
  });

  try {
    const user = await User.create({ email, password, role: 'employee', employee: employee._id });
    return { token: generateToken(user), user };
  } catch (err) {
    await Employee.findByIdAndDelete(employee._id); // roll back the orphan record
    throw err;
  }
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  // Same message for unknown email and wrong password to avoid account enumeration
  if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid credentials');
  if (!user.isActive) throw new ApiError(403, 'This account has been deactivated');
  return { token: generateToken(user), user };
};
