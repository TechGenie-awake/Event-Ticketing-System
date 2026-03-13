const BookingService = require('../services/BookingService');

class BookingController {
  constructor() {
    this.bookingService = new BookingService();
    this.createBooking = this.createBooking.bind(this);
    this.confirmBooking = this.confirmBooking.bind(this);
    this.cancelBooking = this.cancelBooking.bind(this);
    this.getUserBookings = this.getUserBookings.bind(this);
    this.getBookingById = this.getBookingById.bind(this);
  }

  async createBooking(req, res, next) {
    try {
      const { eventId, seatId } = req.body;
      const booking = await this.bookingService.createBooking(req.user.id, eventId, seatId);
      res.status(201).json({ success: true, booking });
    } catch (err) {
      next(err);
    }
  }

  async confirmBooking(req, res, next) {
    try {
      const booking = await this.bookingService.confirmBooking(req.params.id, req.user.id);
      res.json({ success: true, booking });
    } catch (err) {
      next(err);
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const booking = await this.bookingService.cancelBooking(req.params.id, req.user.id);
      res.json({ success: true, booking });
    } catch (err) {
      next(err);
    }
  }

  async getUserBookings(req, res, next) {
    try {
      const bookings = await this.bookingService.getUserBookings(req.user.id);
      res.json({ success: true, bookings });
    } catch (err) {
      next(err);
    }
  }

  async getBookingById(req, res, next) {
    try {
      const booking = await this.bookingService.getBookingById(req.params.id, req.user.id);
      res.json({ success: true, booking });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = BookingController;
