const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendBookingConfirmation(user, booking, event) {
    const mail = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: `Booking Confirmed - ${event.title}`,
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Hi ${user.name},</p>
        <p>Your booking has been confirmed.</p>
        <br/>
        <strong>Reference:</strong> ${booking.bookingReference}<br/>
        <strong>Event:</strong> ${event.title}<br/>
        <strong>Date:</strong> ${new Date(event.eventDate).toDateString()}<br/>
        <strong>Venue:</strong> ${event.venue}, ${event.city}<br/>
        <strong>Amount:</strong> $${booking.totalAmount}<br/>
        <br/>
        <p>Thank you for your purchase!</p>
      `,
    };

    return this.transporter.sendMail(mail);
  }

  async sendCancellationEmail(user, booking, event) {
    const mail = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: `Booking Cancelled - ${event.title}`,
      html: `
        <h2>Booking Cancelled</h2>
        <p>Hi ${user.name},</p>
        <p>Your booking <strong>${booking.bookingReference}</strong> has been cancelled.</p>
        <p>If you have any questions, please contact support.</p>
      `,
    };

    return this.transporter.sendMail(mail);
  }
}

module.exports = EmailService;
