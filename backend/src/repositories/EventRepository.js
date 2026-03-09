const database = require('../config/database');

class EventRepository {
  constructor() {
    this.prisma = database.getClient();
  }

  async findAll(filters = {}) {
    const where = { status: 'PUBLISHED' };

    if (filters.category) where.category = filters.category;
    if (filters.city) where.city = filters.city;
    if (filters.date) {
      where.eventDate = { gte: new Date(filters.date) };
    }

    return this.prisma.event.findMany({
      where,
      orderBy: { eventDate: 'asc' },
    });
  }

  async findById(id) {
    return this.prisma.event.findUnique({
      where: { id },
      include: { seats: true },
    });
  }

  async create(data) {
    return this.prisma.event.create({ data });
  }

  async update(id, data) {
    return this.prisma.event.update({ where: { id }, data });
  }

  async delete(id) {
    return this.prisma.event.delete({ where: { id } });
  }

  async updateAvailableSeats(id, decrement) {
    return this.prisma.event.update({
      where: { id },
      data: { availableSeats: { decrement } },
    });
  }
}

module.exports = EventRepository;
