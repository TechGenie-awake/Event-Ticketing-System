const express = require('express');
const TicketController = require('../controllers/TicketController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const ctrl = new TicketController();

router.use(authenticate);

router.get('/', ctrl.getUserTickets);
router.get('/:id', ctrl.getTicketById);
router.post('/booking/:bookingId', ctrl.generateTicket);
router.post('/validate', authorize('ADMIN'), ctrl.validateTicket);

module.exports = router;
