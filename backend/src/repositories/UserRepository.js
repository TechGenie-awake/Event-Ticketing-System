const database = require('../config/database');

class UserRepository {
  constructor() {
    this.prisma = database.getClient();
  }

  async findById(id) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, name: true, email: true, phone: true, role: true, createdAt: true,
        _count: { select: { bookings: true, tickets: true } },
      },
    });
  }

  async create(data) {
    return this.prisma.user.create({ data });
  }

  async update(id, data) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id) {
    return this.prisma.user.delete({ where: { id } });
  }
}

module.exports = UserRepository;
