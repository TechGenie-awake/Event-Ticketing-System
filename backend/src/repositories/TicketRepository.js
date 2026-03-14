const database = require('../config/database');

class TicketRepository {
  constructor() {
    this.prisma = database.getClient();
  }

  async findById(id) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: { booking: { include: { event: true, seat: true } } },
    });
  }

  async findByBooking(bookingId) {
    return this.prisma.ticket.findUnique({ where: { bookingId } });
  }

  async findByUser(userId) {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: { booking: { include: { event: true, seat: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByQrString(qrString) {
    return this.prisma.ticket.findUnique({ where: { qrString } });
  }

  async create(data) {
    return this.prisma.ticket.create({ data });
  }

  async update(id, data) {
    return this.prisma.ticket.update({ where: { id }, data });
  }
}

module.exports = TicketRepository;
