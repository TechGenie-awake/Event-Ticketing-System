const EventRepository = require('../repositories/EventRepository');

class EventService {
  constructor() {
    this.eventRepo = new EventRepository();
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
    return {
      available: event.availableSeats > 0,
      availableSeats: event.availableSeats,
      seats: event.seats,
    };
  }
}

module.exports = EventService;
