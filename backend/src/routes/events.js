const express = require('express');
const EventController = require('../controllers/EventController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const ctrl = new EventController();

router.get('/', ctrl.getAllEvents);
router.get('/:id', ctrl.getEventById);
router.get('/:id/availability', ctrl.checkAvailability);

router.post('/', authenticate, authorize('ADMIN'), ctrl.createEvent);
router.put('/:id', authenticate, authorize('ADMIN'), ctrl.updateEvent);
router.delete('/:id', authenticate, authorize('ADMIN'), ctrl.deleteEvent);

module.exports = router;
