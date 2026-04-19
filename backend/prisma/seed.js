const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@test.com', password: adminPassword, role: 'ADMIN' },
  });

  // Regular user
  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: { name: 'Test User', email: 'user@test.com', password: userPassword, role: 'USER' },
  });

  // Events
  const events = [
    {
      id: 'event-1',
      title: 'Coldplay World Tour 2026',
      description: 'Experience the magic of Coldplay live! From their iconic hits like "Yellow" and "Fix You" to tracks from their latest album, this concert promises an unforgettable night of music, stunning visuals, and pure emotion. The Music of the Spheres World Tour features state-of-the-art LED wristbands, laser shows, and sustainable stage design.',
      eventDate: new Date('2026-05-15'),
      eventTime: '7:00 PM',
      venue: 'DY Patil Stadium',
      city: 'Mumbai',
      category: 'concert',
      totalSeats: 30,
      availableSeats: 30,
      minPrice: 1500,
      maxPrice: 5000,
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    },
    {
      id: 'event-2',
      title: 'IPL 2026 - MI vs CSK',
      description: 'The greatest rivalry in cricket returns! Mumbai Indians take on Chennai Super Kings in what promises to be an electrifying clash. Watch the biggest stars of T20 cricket battle it out under the floodlights at the iconic Wankhede Stadium. Get your seats now for this sold-out-every-year blockbuster.',
      eventDate: new Date('2026-05-22'),
      eventTime: '7:30 PM',
      venue: 'Wankhede Stadium',
      city: 'Mumbai',
      category: 'sports',
      totalSeats: 20,
      availableSeats: 20,
      minPrice: 800,
      maxPrice: 2500,
      imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    },
    {
      id: 'event-3',
      title: 'Stand-Up Night with Zakir Khan',
      description: 'Get ready for a night of non-stop laughter! Zakir Khan brings his signature storytelling style and relatable humor in this all-new special. From everyday life observations to hilarious takes on relationships, this show is guaranteed to leave your cheeks hurting from laughing.',
      eventDate: new Date('2026-06-05'),
      eventTime: '8:00 PM',
      venue: 'NSCI Dome',
      city: 'Mumbai',
      category: 'comedy',
      totalSeats: 20,
      availableSeats: 20,
      minPrice: 500,
      maxPrice: 2000,
      imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
    },
    {
      id: 'event-4',
      title: 'Hamilton - The Musical',
      description: 'The story of America then, told by America now. Hamilton is the story of the unlikely Founding Father determined to make his mark on the new nation as hungry and ambitious as he is. From bastard orphan to Washington\'s right-hand man, this revolutionary tale of ambition, love, and legacy has captivated audiences worldwide.',
      eventDate: new Date('2026-06-12'),
      eventTime: '6:30 PM',
      venue: 'Royal Opera House',
      city: 'Mumbai',
      category: 'theater',
      totalSeats: 20,
      availableSeats: 20,
      minPrice: 1200,
      maxPrice: 4500,
      imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&q=80',
    },
  ];

  const seatConfigs = {
    'event-1': [
      { rows: ['A', 'B'], section: 'Premium', price: 5000 },
      { rows: ['C'], section: 'Standard', price: 3000 },
    ],
    'event-2': [
      { rows: ['A'], section: 'Premium', price: 2500 },
      { rows: ['B'], section: 'Standard', price: 800 },
    ],
    'event-3': [
      { rows: ['A'], section: 'Premium', price: 2000 },
      { rows: ['B'], section: 'Standard', price: 500 },
    ],
    'event-4': [
      { rows: ['A'], section: 'Premium', price: 4500 },
      { rows: ['B'], section: 'Standard', price: 1200 },
    ],
  };

  for (const eventData of events) {
    await prisma.event.upsert({
      where: { id: eventData.id },
      update: { description: eventData.description, imageUrl: eventData.imageUrl },
      create: { ...eventData, status: 'PUBLISHED' },
    });

    const config = seatConfigs[eventData.id];
    for (const sec of config) {
      for (const row of sec.rows) {
        for (let num = 1; num <= 10; num++) {
          await prisma.seat.upsert({
            where: { eventId_row_number: { eventId: eventData.id, row, number: num } },
            update: {},
            create: { eventId: eventData.id, row, number: num, section: sec.section, price: sec.price },
          });
        }
      }
    }
  }

  console.log('Seed complete!');
  console.log('  Admin  → admin@test.com / admin123');
  console.log('  User   → user@test.com  / user123');
  console.log('  Events → 4 events seeded');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
