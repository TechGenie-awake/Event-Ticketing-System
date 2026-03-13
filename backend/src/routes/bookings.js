const express = require('express');
const BookingController = require('../controllers/BookingController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();
const ctrl = new BookingController();

router.use(authenticate);

router.post('/', ctrl.createBooking);
router.get('/', ctrl.getUserBookings);
router.get('/:id', ctrl.getBookingById);
router.post('/:id/confirm', ctrl.confirmBooking);
router.post('/:id/cancel', ctrl.cancelBooking);

module.exports = router;
