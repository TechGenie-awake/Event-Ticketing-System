const { PrismaClient } = require('@prisma/client');

class Database {
  constructor() {
    if (!Database.instance) {
      this.prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
      });
      Database.instance = this;
    }
    return Database.instance;
  }

  getClient() {
    return this.prisma;
  }

  async connect() {
    await this.prisma.$connect();
    console.log('Connected to NeonDB via Prisma');
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}

const database = new Database();
module.exports = database;
