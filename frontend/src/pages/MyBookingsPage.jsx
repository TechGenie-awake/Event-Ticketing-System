import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const STATUS_STYLES = {
  CONFIRMED: { bg: '#1a2e1a', border: '#166534', text: '#4ade80' },
  CANCELLED: { bg: '#2e1a1a', border: '#991b1b', text: '#f87171' },
  PENDING: { bg: '#2e2a1a', border: '#854d0e', text: '#fbbf24' },
  COMPLETED: { bg: '#1a1a2e', border: '#1e40af', text: '#60a5fa' },
};

function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/bookings')
      .then((res) => setBookings(res.data.bookings))
      .catch(() => setError('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = async (id) => {
    try {
      await api.post(`/bookings/${id}/confirm`);
      setBookings(bookings.map((b) => (b.id === id ? { ...b, status: 'CONFIRMED' } : b)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm');
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.post(`/bookings/${id}/cancel`);
      setBookings(bookings.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const handleGenerateTicket = async (bookingId) => {
    try {
      await api.post(`/tickets/booking/${bookingId}`);
      navigate('/my-tickets');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate ticket');
    }
  };

  if (loading) return <p style={{ padding: '3rem', color: '#525252' }}>Loading bookings...</p>;
  if (error) return <p style={{ padding: '3rem', color: '#ef4444' }}>{error}</p>;

  return (
    <div style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <p style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>MANAGE</p>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', marginBottom: '2rem' }}>My Bookings</h1>

      {bookings.length === 0 && <p style={{ color: '#404040', fontSize: '1rem' }}>No bookings yet. Browse events to get started.</p>}

      {bookings.map((booking) => {
        const s = STATUS_STYLES[booking.status] || STATUS_STYLES.PENDING;
        return (
          <div key={booking.id} style={{
            background: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px',
            padding: '1.5rem', marginBottom: '1rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem' }}>{booking.event?.title}</h3>
                <p style={{ color: '#525252', fontSize: '0.85rem' }}>
                  {new Date(booking.event?.eventDate).toDateString()} | {booking.event?.venue}
                </p>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '0.75rem' }}>
                  <div>
                    <p style={{ color: '#404040', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Seat</p>
                    <p style={{ color: '#e5e5e5', fontWeight: '600', fontSize: '0.9rem' }}>{booking.seat?.row}{booking.seat?.number} ({booking.seat?.section})</p>
                  </div>
                  <div>
                    <p style={{ color: '#404040', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</p>
                    <p style={{ color: '#e5e5e5', fontWeight: '600', fontSize: '0.9rem' }}>₹{booking.totalAmount}</p>
                  </div>
                  <div>
                    <p style={{ color: '#404040', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reference</p>
                    <p style={{ color: '#737373', fontWeight: '500', fontSize: '0.8rem', fontFamily: 'monospace' }}>{booking.bookingReference}</p>
                  </div>
                </div>
              </div>
              <span style={{
                padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600',
                background: s.bg, border: `1px solid ${s.border}`, color: s.text,
              }}>
                {booking.status}
              </span>
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #1f1f1f', display: 'flex', gap: '0.5rem' }}>
              {booking.status === 'PENDING' && (
                <>
                  <button onClick={() => handleConfirm(booking.id)} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Confirm</button>
                  <button onClick={() => handleCancel(booking.id)} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: '#7f1d1d', color: '#fca5a5' }}>Cancel</button>
                </>
              )}
              {booking.status === 'CONFIRMED' && !booking.ticket && (
                <button onClick={() => handleGenerateTicket(booking.id)} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: '#14532d', color: '#86efac' }}>
                  Generate Ticket
                </button>
              )}
              {booking.status === 'CONFIRMED' && booking.ticket && (
                <span style={{ color: '#525252', fontSize: '0.8rem', padding: '0.4rem 0' }}>Ticket generated — check My Tickets</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MyBookingsPage;
