const qrcode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const TicketRepository = require('../repositories/TicketRepository');
const BookingRepository = require('../repositories/BookingRepository');

class TicketService {
  constructor() {
    this.ticketRepo = new TicketRepository();
    this.bookingRepo = new BookingRepository();
  }

  async generateTicket(bookingId, userId) {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.userId !== userId) throw new Error('Unauthorized');
    if (booking.status !== 'CONFIRMED') throw new Error('Booking must be confirmed first');

    const existing = await this.ticketRepo.findByBooking(bookingId);
    if (existing) return existing;

    const qrString = `TKT-${bookingId}-${uuidv4()}`;
    const qrData = JSON.stringify({
      bookingId,
      userId,
      eventId: booking.eventId,
      seatId: booking.seatId,
      issuedAt: new Date().toISOString(),
    });

    const qrCode = await qrcode.toDataURL(qrData);
    const ticketNumber = `TKT-${Date.now()}-${uuidv4().substring(0, 6).toUpperCase()}`;

    return this.ticketRepo.create({
      ticketNumber,
      bookingId,
      userId,
      eventId: booking.eventId,
      seatId: booking.seatId,
      qrCode,
      qrString,
    });
  }

  async getTicketById(ticketId, userId) {
    const ticket = await this.ticketRepo.findById(ticketId);
    if (!ticket) throw new Error('Ticket not found');
    if (ticket.userId !== userId) throw new Error('Unauthorized');
    return ticket;
  }

  async getUserTickets(userId) {
    return this.ticketRepo.findByUser(userId);
  }

  async validateTicket(qrString) {
    const ticket = await this.ticketRepo.findByQrString(qrString);
    if (!ticket) return { valid: false, message: 'Ticket not found' };
    if (ticket.status === 'SCANNED') return { valid: false, message: 'Already scanned' };
    if (ticket.status === 'CANCELLED') return { valid: false, message: 'Ticket cancelled' };

    await this.ticketRepo.update(ticket.id, { status: 'SCANNED' });
    return { valid: true, ticket };
  }
}

module.exports = TicketService;
