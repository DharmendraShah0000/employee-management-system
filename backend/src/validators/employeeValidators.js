const { body, param } = require('express-validator');

const optionalFields = [
  body('phone').optional({ checkFalsy: true }).trim().isLength({ max: 20 }).withMessage('Phone is too long'),
  body('address').optional({ checkFalsy: true }).trim().isLength({ max: 200 }),
  body('department').optional({ checkFalsy: true }).isMongoId().withMessage('Invalid department'),
  body('designation').optional({ checkFalsy: true }).trim().isLength({ max: 80 }),
  body('salary').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Salary must be a positive number'),
  body('joiningDate').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid joining date'),
  body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status'),
];

exports.idRule = [param('id').isMongoId().withMessage('Invalid id')];

exports.createEmployeeRules = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .optional({ checkFalsy: true })
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ...optionalFields,
];

exports.updateEmployeeRules = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  ...optionalFields,
];
