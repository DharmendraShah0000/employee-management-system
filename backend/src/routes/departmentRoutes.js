const router = require('express').Router();
const ctrl = require('../controllers/departmentController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { idRule } = require('../validators/employeeValidators');
const { departmentRules } = require('../validators/departmentValidators');

router.use(authenticate);

router.get('/', ctrl.list);
router.post('/', authorize('admin'), departmentRules, validate, ctrl.create);
router.put('/:id', authorize('admin'), idRule, departmentRules, validate, ctrl.update);
router.delete('/:id', authorize('admin'), idRule, validate, ctrl.remove);

module.exports = router;
