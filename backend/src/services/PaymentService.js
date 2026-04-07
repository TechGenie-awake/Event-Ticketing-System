const { v4: uuidv4 } = require('uuid');
const database = require('../config/database');

class PaymentService {
  constructor() {
    this.prisma = database.getClient();
  }

  async processPayment(bookingId, userId, paymentMethod = 'mock') {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new Error('Booking not found');
    if (booking.userId !== userId) throw new Error('Unauthorized');
    if (booking.status !== 'PENDING') throw new Error('Booking is not pending');

    // Mock payment - 95% success rate
    const success = Math.random() > 0.05;
    const transactionId = `TXN-${uuidv4().toUpperCase()}`;

    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        userId,
        amount: booking.totalAmount,
        paymentMethod,
        transactionId,
        status: success ? 'COMPLETED' : 'FAILED',
      },
    });

    if (success) {
      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      });
    }

    return payment;
  }

  async getPaymentByBooking(bookingId, userId) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.userId !== userId) throw new Error('Unauthorized');

    return this.prisma.payment.findUnique({ where: { bookingId } });
  }
}

module.exports = PaymentService;
