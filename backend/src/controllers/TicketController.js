const TicketService = require('../services/TicketService');

class TicketController {
  constructor() {
    this.ticketService = new TicketService();
    this.generateTicket = this.generateTicket.bind(this);
    this.getTicketById = this.getTicketById.bind(this);
    this.getUserTickets = this.getUserTickets.bind(this);
    this.validateTicket = this.validateTicket.bind(this);
  }

  async generateTicket(req, res, next) {
    try {
      const ticket = await this.ticketService.generateTicket(req.params.bookingId, req.user.id);
      res.status(201).json({ success: true, ticket });
    } catch (err) {
      next(err);
    }
  }

  async getTicketById(req, res, next) {
    try {
      const ticket = await this.ticketService.getTicketById(req.params.id, req.user.id);
      res.json({ success: true, ticket });
    } catch (err) {
      next(err);
    }
  }

  async getUserTickets(req, res, next) {
    try {
      const tickets = await this.ticketService.getUserTickets(req.user.id);
      res.json({ success: true, tickets });
    } catch (err) {
      next(err);
    }
  }

  async validateTicket(req, res, next) {
    try {
      const result = await this.ticketService.validateTicket(req.body.qrString);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TicketController;
