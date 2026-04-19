const EventRepository = require('../repositories/EventRepository');
const SeatRepository = require('../repositories/SeatRepository');

class EventService {
  constructor() {
    this.eventRepo = new EventRepository();
    this.seatRepo = new SeatRepository();
  }

  async getAllEvents(filters) {
    return this.eventRepo.findAll(filters);
  }

  async getEventById(id) {
    const event = await this.eventRepo.findById(id);
    if (!event) throw new Error('Event not found');
    return event;
  }

  async createEvent(data) {
    data.availableSeats = data.totalSeats;
    return this.eventRepo.create(data);
  }

  async updateEvent(id, data) {
    await this.getEventById(id);
    return this.eventRepo.update(id, data);
  }

  async deleteEvent(id) {
    await this.getEventById(id);
    return this.eventRepo.delete(id);
  }

  async checkAvailability(eventId) {
    const event = await this.eventRepo.findById(eventId);
    if (!event) throw new Error('Event not found');
    const available = event.seats.filter((s) => s.status === 'AVAILABLE');
    return {
      available: available.length > 0,
      availableSeats: available.length,
      seats: event.seats,
    };
  }
  async addSeats(eventId, sections) {
    const event = await this.getEventById(eventId);
    const seats = [];
    for (const section of sections) {
      for (const row of section.rows) {
        for (let num = 1; num <= section.seatsPerRow; num++) {
          seats.push({ row, number: num, section: section.name, price: section.price });
        }
      }
    }
    const result = await this.seatRepo.createSeatsForEvent(eventId, seats);
    const totalNew = result.count;
    await this.eventRepo.update(eventId, {
      totalSeats: event.totalSeats + totalNew,
      availableSeats: event.availableSeats + totalNew,
    });
    return this.eventRepo.findById(eventId);
  }
}

module.exports = EventService;
