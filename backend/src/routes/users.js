const express = require('express');
const UserController = require('../controllers/UserController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const ctrl = new UserController();

router.get('/', authenticate, authorize('ADMIN'), ctrl.getAllUsers);
router.put('/:id/role', authenticate, authorize('ADMIN'), ctrl.updateRole);

module.exports = router;
