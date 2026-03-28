const { v4: uuidv4 } = require('uuid');
const BookingRepository = require('../repositories/BookingRepository');
const SeatRepository = require('../repositories/SeatRepository');
const EventRepository = require('../repositories/EventRepository');

class BookingService {
  constructor() {
    this.bookingRepo = new BookingRepository();
    this.seatRepo = new SeatRepository();
    this.eventRepo = new EventRepository();
  }

  async createBooking(userId, eventId, seatId) {
    const event = await this.eventRepo.findById(eventId);
    if (!event || event.status !== 'PUBLISHED') {
      throw new Error('Event not available');
    }

    // Hold the seat atomically to prevent race conditions
    await this.seatRepo.holdSeat(seatId);

    const seat = await this.seatRepo.findById(seatId);

    const booking = await this.bookingRepo.create({
      bookingReference: `BK-${Date.now()}-${uuidv4().substring(0, 6).toUpperCase()}`,
      userId,
      eventId,
      seatId,
      totalAmount: seat.price,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    await this.eventRepo.updateAvailableSeats(eventId, 1);

    return booking;
  }

  async confirmBooking(bookingId, userId) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.userId !== userId) throw new Error('Unauthorized');
    if (booking.status !== 'PENDING') throw new Error('Booking cannot be confirmed');

    if (booking.expiresAt && new Date() > booking.expiresAt) {
      await this.cancelBooking(bookingId, userId);
      throw new Error('Booking has expired');
    }

    await this.seatRepo.bookSeat(booking.seatId);

    return this.bookingRepo.update(bookingId, {
      status: 'CONFIRMED',
      version: { increment: 1 },
    });
  }

  async cancelBooking(bookingId, userId) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.userId !== userId) throw new Error('Unauthorized');
    if (booking.status === 'CANCELLED') throw new Error('Booking already cancelled');

    // only release seat if it hasn't already been freed
    if (booking.seat && booking.seat.status !== 'AVAILABLE') {
      await this.seatRepo.releaseSeat(booking.seatId);
      await this.eventRepo.updateAvailableSeats(booking.eventId, -1);
    }

    return this.bookingRepo.update(bookingId, { status: 'CANCELLED' });
  }

  async getUserBookings(userId) {
    return this.bookingRepo.findByUser(userId);
  }

  async getBookingById(bookingId, userId) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.userId !== userId) throw new Error('Unauthorized');
    return booking;
  }
}

module.exports = BookingService;
