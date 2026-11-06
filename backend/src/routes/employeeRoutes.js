const router = require('express').Router();
const ctrl = require('../controllers/employeeController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { idRule, createEmployeeRules, updateEmployeeRules } = require('../validators/employeeValidators');

router.use(authenticate);

router.get('/me', ctrl.me); // must be declared before '/:id'
router.get('/', authorize('admin'), ctrl.list);
router.post('/', authorize('admin'), createEmployeeRules, validate, ctrl.create);
router.get('/:id', idRule, validate, ctrl.getOne);
router.put('/:id', idRule, updateEmployeeRules, validate, ctrl.update);
router.delete('/:id', authorize('admin'), idRule, validate, ctrl.remove);

module.exports = router;
