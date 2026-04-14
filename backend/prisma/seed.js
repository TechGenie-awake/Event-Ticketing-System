const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@test.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      name: 'Test User',
      email: 'user@test.com',
      password: userPassword,
      role: 'USER',
    },
  });

  // Event 1
  const event1 = await prisma.event.upsert({
    where: { id: 'event-1' },
    update: {},
    create: {
      id: 'event-1',
      title: 'Coldplay World Tour 2026',
      description: 'An unforgettable night with Coldplay live in concert.',
      eventDate: new Date('2026-05-15'),
      eventTime: '7:00 PM',
      venue: 'DY Patil Stadium',
      city: 'Mumbai',
      category: 'concert',
      totalSeats: 30,
      availableSeats: 30,
      minPrice: 1500,
      maxPrice: 5000,
      status: 'PUBLISHED',
    },
  });

  // Seats for Event 1 (rows A-C, 10 seats each)
  const sections = { A: 'Premium', B: 'Standard', C: 'Economy' };
  const prices = { A: 5000, B: 3000, C: 1500 };

  for (const row of ['A', 'B', 'C']) {
    for (let num = 1; num <= 10; num++) {
      await prisma.seat.upsert({
        where: { eventId_row_number: { eventId: 'event-1', row, number: num } },
        update: {},
        create: {
          eventId: 'event-1',
          row,
          number: num,
          section: sections[row],
          price: prices[row],
        },
      });
    }
  }

  // Event 2
  const event2 = await prisma.event.upsert({
    where: { id: 'event-2' },
    update: {},
    create: {
      id: 'event-2',
      title: 'IPL 2026 - MI vs CSK',
      description: 'Mumbai Indians vs Chennai Super Kings - the ultimate clash.',
      eventDate: new Date('2026-05-22'),
      eventTime: '7:30 PM',
      venue: 'Wankhede Stadium',
      city: 'Mumbai',
      category: 'sports',
      totalSeats: 20,
      availableSeats: 20,
      minPrice: 800,
      maxPrice: 2500,
      status: 'PUBLISHED',
    },
  });

  for (const row of ['A', 'B']) {
    for (let num = 1; num <= 10; num++) {
      await prisma.seat.upsert({
        where: { eventId_row_number: { eventId: 'event-2', row, number: num } },
        update: {},
        create: {
          eventId: 'event-2',
          row,
          number: num,
          section: row === 'A' ? 'Premium' : 'Standard',
          price: row === 'A' ? 2500 : 800,
        },
      });
    }
  }

  console.log('Seed complete!');
  console.log('  Admin  → admin@test.com / admin123');
  console.log('  User   → user@test.com  / user123');
  console.log('  Events → Coldplay Tour, IPL MI vs CSK');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
