const router = require('express').Router();
const ctrl = require('../controllers/dashboardController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/stats', authenticate, authorize('admin'), ctrl.stats);

module.exports = router;
