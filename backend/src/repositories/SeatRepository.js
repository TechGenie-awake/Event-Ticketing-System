const database = require('../config/database');

class SeatRepository {
  constructor() {
    this.prisma = database.getClient();
  }

  async findByEvent(eventId) {
    return this.prisma.seat.findMany({ where: { eventId } });
  }

  async findById(id) {
    return this.prisma.seat.findUnique({ where: { id } });
  }

  async findAvailable(eventId) {
    return this.prisma.seat.findMany({
      where: { eventId, status: 'AVAILABLE' },
    });
  }

  async holdSeat(id) {
    const seat = await this.findById(id);
    if (!seat || seat.status !== 'AVAILABLE') {
      throw new Error('Seat not available');
    }

    const heldUntil = new Date(Date.now() + 10 * 60 * 1000);
    return this.prisma.seat.update({
      where: { id, version: seat.version },
      data: {
        status: 'HELD',
        heldUntil,
        version: { increment: 1 },
      },
    });
  }

  async bookSeat(id) {
    return this.prisma.seat.update({
      where: { id },
      data: { status: 'BOOKED', heldUntil: null, version: { increment: 1 } },
    });
  }

  async releaseSeat(id) {
    return this.prisma.seat.update({
      where: { id },
      data: { status: 'AVAILABLE', heldUntil: null, version: { increment: 1 } },
    });
  }

  async createSeatsForEvent(eventId, seats) {
    return this.prisma.seat.createMany({
      data: seats.map(s => ({ ...s, eventId })),
      skipDuplicates: true,
    });
  }
}

module.exports = SeatRepository;
