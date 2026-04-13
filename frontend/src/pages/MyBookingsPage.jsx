import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

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

  if (loading) return <p style={{ padding: '2rem' }}>Loading bookings...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  const statusColor = {
    CONFIRMED: { bg: '#dcfce7', text: '#166534' },
    CANCELLED: { bg: '#fee2e2', text: '#991b1b' },
    PENDING: { bg: '#fef9c3', text: '#854d0e' },
    COMPLETED: { bg: '#dbeafe', text: '#1e40af' },
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>My Bookings</h2>
      {bookings.length === 0 && <p style={{ color: '#6b7280' }}>No bookings yet.</p>}
      {bookings.map((booking) => {
        const colors = statusColor[booking.status] || statusColor.PENDING;
        return (
          <div key={booking.id} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h3 style={{ marginBottom: '0.3rem' }}>{booking.event?.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  {new Date(booking.event?.eventDate).toDateString()} | {booking.event?.venue}
                </p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
                  Seat: <strong>{booking.seat?.row}{booking.seat?.number}</strong> ({booking.seat?.section}) | Ref: {booking.bookingReference}
                </p>
                <p style={{ fontSize: '0.85rem' }}>Amount: <strong>${booking.totalAmount}</strong></p>
              </div>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: '600',
                background: colors.bg,
                color: colors.text,
              }}>
                {booking.status}
              </span>
            </div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              {booking.status === 'PENDING' && (
                <>
                  <button onClick={() => handleConfirm(booking.id)} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
                    Confirm
                  </button>
                  <button onClick={() => handleCancel(booking.id)} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: '#ef4444' }}>
                    Cancel
                  </button>
                </>
              )}
              {booking.status === 'CONFIRMED' && !booking.ticket && (
                <button onClick={() => handleGenerateTicket(booking.id)} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: '#16a34a' }}>
                  Generate Ticket
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MyBookingsPage;
