import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  if (loading) return <p style={{ padding: '3rem', color: '#525252' }}>Loading tickets...</p>;
  if (error) return <p style={{ padding: '3rem', color: '#ef4444' }}>{error}</p>;

  return (
    <div style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <p style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>YOUR PASSES</p>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', marginBottom: '2rem' }}>My Tickets</h1>

      {tickets.length === 0 && <p style={{ color: '#404040', fontSize: '1rem' }}>No tickets yet. Confirm a booking first, then generate your ticket.</p>}

      {tickets.map((ticket) => (
        <div key={ticket.id} style={{
          background: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px',
          overflow: 'hidden', marginBottom: '1.25rem',
        }}>
          <div style={{ display: 'flex' }}>
            {/* Ticket Info */}
            <div style={{ flex: 1, padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: '700' }}>{ticket.booking?.event?.title}</h3>
                <span style={{
                  padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.65rem', fontWeight: '600',
                  background: ticket.status === 'ACTIVE' ? '#1a2e1a' : '#2e1a1a',
                  border: `1px solid ${ticket.status === 'ACTIVE' ? '#166534' : '#991b1b'}`,
                  color: ticket.status === 'ACTIVE' ? '#4ade80' : '#f87171',
                }}>
                  {ticket.status}
                </span>
              </div>

              <div style={{ color: '#525252', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                📅 {new Date(ticket.booking?.event?.eventDate).toDateString()} • {ticket.booking?.event?.eventTime}
              </div>
              <div style={{ color: '#525252', fontSize: '0.85rem', marginBottom: '1rem' }}>
                📍 {ticket.booking?.event?.venue}
              </div>

              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <p style={{ color: '#404040', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Seat</p>
                  <p style={{ color: '#e5e5e5', fontWeight: '600' }}>{ticket.booking?.seat?.row}{ticket.booking?.seat?.number}</p>
                </div>
                <div>
                  <p style={{ color: '#404040', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Section</p>
                  <p style={{ color: '#e5e5e5', fontWeight: '600' }}>{ticket.booking?.seat?.section}</p>
                </div>
                <div>
                  <p style={{ color: '#404040', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ticket #</p>
                  <p style={{ color: '#737373', fontWeight: '500', fontSize: '0.75rem', fontFamily: 'monospace' }}>{ticket.ticketNumber}</p>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #1f1f1f' }}>
                <Link to={`/ticket/${ticket.id}`}>
                  <button style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>View / Print Ticket</button>
                </Link>
              </div>
            </div>

            {/* QR Code */}
            {ticket.qrCode && (
              <div style={{
                borderLeft: '1px dashed #2a2a2a', padding: '1.5rem', display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: '#111',
              }}>
                <img src={ticket.qrCode} alt="QR" style={{ width: '120px', height: '120px', borderRadius: '6px' }} />
                <p style={{ fontSize: '0.65rem', color: '#404040', marginTop: '0.5rem', textAlign: 'center' }}>Scan at entry</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyTicketsPage;
