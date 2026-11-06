const jwt = require('jsonwebtoken');
const env = require('../config/env');

module.exports = (user) =>
  jwt.sign({ id: user._id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
