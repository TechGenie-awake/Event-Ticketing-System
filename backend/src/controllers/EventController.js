const EventService = require('../services/EventService');

class EventController {
  constructor() {
    this.eventService = new EventService();
    this.getAllEvents = this.getAllEvents.bind(this);
    this.getEventById = this.getEventById.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.checkAvailability = this.checkAvailability.bind(this);
    this.addSeats = this.addSeats.bind(this);
  }

  async getAllEvents(req, res, next) {
    try {
      const events = await this.eventService.getAllEvents(req.query);
      res.json({ success: true, events });
    } catch (err) {
      next(err);
    }
  }

  async getEventById(req, res, next) {
    try {
      const event = await this.eventService.getEventById(req.params.id);
      res.json({ success: true, event });
    } catch (err) {
      next(err);
    }
  }

  async createEvent(req, res, next) {
    try {
      const event = await this.eventService.createEvent(req.body);
      res.status(201).json({ success: true, event });
    } catch (err) {
      next(err);
    }
  }

  async updateEvent(req, res, next) {
    try {
      const event = await this.eventService.updateEvent(req.params.id, req.body);
      res.json({ success: true, event });
    } catch (err) {
      next(err);
    }
  }

  async deleteEvent(req, res, next) {
    try {
      await this.eventService.deleteEvent(req.params.id);
      res.json({ success: true, message: 'Event deleted' });
    } catch (err) {
      next(err);
    }
  }

  async checkAvailability(req, res, next) {
    try {
      const data = await this.eventService.checkAvailability(req.params.id);
      res.json({ success: true, ...data });
    } catch (err) {
      next(err);
    }
  }
  async addSeats(req, res, next) {
    try {
      const event = await this.eventService.addSeats(req.params.id, req.body.sections);
      res.status(201).json({ success: true, event });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = EventController;
