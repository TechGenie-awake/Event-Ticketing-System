import { useState, useEffect } from 'react';
import api from '../api/axios';

function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/tickets')
      .then((res) => setTickets(res.data.tickets))
      .catch(() => setError('Failed to load tickets'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading tickets...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>My Tickets</h2>
      {tickets.length === 0 && <p style={{ color: '#6b7280' }}>No tickets yet. Confirm a booking first, then generate your ticket.</p>}
      {tickets.map((ticket) => (
        <div key={ticket.id} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
            <div style={{ flex: 1 }}>
              <h3>{ticket.booking?.event?.title}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                {new Date(ticket.booking?.event?.eventDate).toDateString()} | {ticket.booking?.event?.eventTime}
              </p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>
                Venue: {ticket.booking?.event?.venue}
              </p>
              <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Seat: <strong>{ticket.booking?.seat?.row}{ticket.booking?.seat?.number}</strong> | Section: {ticket.booking?.seat?.section}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.3rem' }}>
                Ticket #: {ticket.ticketNumber}
              </p>
              <span style={{
                display: 'inline-block',
                marginTop: '0.5rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600',
                background: ticket.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
                color: ticket.status === 'ACTIVE' ? '#166534' : '#991b1b',
              }}>
                {ticket.status}
              </span>
            </div>
            {ticket.qrCode && (
              <div style={{ textAlign: 'center' }}>
                <img src={ticket.qrCode} alt="QR Code" style={{ width: '130px', height: '130px', border: '1px solid #e5e7eb', borderRadius: '4px' }} />
                <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.3rem' }}>Scan at entry</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyTicketsPage;
