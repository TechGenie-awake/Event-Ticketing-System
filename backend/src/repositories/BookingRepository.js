const database = require('../config/database');

class BookingRepository {
  constructor() {
    this.prisma = database.getClient();
  }

  async findById(id) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: { event: true, seat: true, ticket: true, payment: true },
    });
  }

  async findByUser(userId) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { event: true, seat: true, ticket: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByReference(bookingReference) {
    return this.prisma.booking.findUnique({ where: { bookingReference } });
  }

  async create(data) {
    return this.prisma.booking.create({ data });
  }

  async update(id, data) {
    return this.prisma.booking.update({ where: { id }, data });
  }

  async cancelExpired() {
    const now = new Date();
    return this.prisma.booking.updateMany({
      where: { status: 'PENDING', expiresAt: { lte: now } },
      data: { status: 'CANCELLED' },
    });
  }
}

module.exports = BookingRepository;
