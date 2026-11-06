require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Department = require('../models/Department');
const { nextEmployeeId } = require('../services/employeeService');

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'Admin@12345';

    if (await User.findOne({ email })) {
      console.log(`Admin ${email} already exists. Nothing to do.`);
    } else {
      const employee = await Employee.create({
        employeeId: await nextEmployeeId(),
        firstName: process.env.ADMIN_FIRST_NAME || 'System',
        lastName: process.env.ADMIN_LAST_NAME || 'Admin',
        email,
        designation: 'Administrator',
      });
      await User.create({ email, password, role: 'admin', employee: employee._id });
      console.log(`Admin created: ${email}`);
    }

    // Starter departments (only if none exist)
    if ((await Department.countDocuments()) === 0) {
      await Department.insertMany(
        ['Engineering', 'Human Resources', 'Finance', 'Marketing', 'Operations'].map((name) => ({ name }))
      );
      console.log('Starter departments created');
    }
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
