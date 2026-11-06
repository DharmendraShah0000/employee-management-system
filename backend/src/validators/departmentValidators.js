const { body } = require('express-validator');

exports.departmentRules = [
  body('name').trim().notEmpty().withMessage('Department name is required').isLength({ max: 80 }),
  body('description').optional().trim().isLength({ max: 300 }),
];
