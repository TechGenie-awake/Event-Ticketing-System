import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SEAT_COLORS = {
  AVAILABLE: '#1a2e1a',
  HELD: '#2e2a1a',
  BOOKED: '#1a1a1a',
  SELECTED: '#312e81',
};

const SEAT_BORDERS = {
  AVAILABLE: '#22c55e',
  HELD: '#f59e0b',
  BOOKED: '#333',
  SELECTED: '#6366f1',
};

function BookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/events/${eventId}`)
      .then((res) => {
        setEvent(res.data.event);
        setSeats(res.data.event.seats || []);
      })
      .catch(() => setError('Failed to load event'))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleSeatClick = (seat) => {
    if (seat.status !== 'AVAILABLE') return;
    setSelectedSeat(selectedSeat?.id === seat.id ? null : seat);
  };

  const handleBooking = async () => {
    if (!selectedSeat) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/bookings', { eventId, seatId: selectedSeat.id });
      setBooking(res.data.booking);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: '3rem', color: '#525252' }}>Loading...</p>;
  if (error && !event) return <p style={{ padding: '3rem', color: '#ef4444' }}>{error}</p>;

  if (booking) {
    return (
      <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          maxWidth: '450px', padding: '3rem', textAlign: 'center',
          background: '#141414', borderRadius: '16px', border: '1px solid #1f1f1f',
        }}>
          <div style={{ width: '56px', height: '56px', background: '#1a2e1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>✓</div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Booking Created</h2>
          <p style={{ color: '#525252', marginBottom: '1.5rem' }}>Complete payment within 30 minutes to confirm.</p>
          <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #1f1f1f' }}>
            <p style={{ color: '#737373', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Booking Reference</p>
            <p style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem', fontFamily: 'monospace' }}>{booking.bookingReference}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => navigate('/my-bookings')} style={{ flex: 1, padding: '0.65rem' }}>My Bookings</button>
            <button onClick={() => navigate('/events')} style={{ flex: 1, padding: '0.65rem', background: '#1f1f1f', color: '#a3a3a3' }}>Back to Events</button>
          </div>
        </div>
      </div>
    );
  }

  const rows = [...new Set(seats.map((s) => s.row))].sort();

  return (
    <div style={{ padding: '3rem', maxWidth: '900px', margin: '0 auto' }}>
      {event && (
        <>
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>SELECT YOUR SEAT</p>
            <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>{event.title}</h1>
            <p style={{ color: '#525252', fontSize: '0.9rem' }}>
              {new Date(event.eventDate).toDateString()} • {event.eventTime} • {event.venue}, {event.city}
            </p>
          </div>

          {/* Stage */}
          <div style={{
            background: 'linear-gradient(180deg, #1e1b4b, #0f0e26)',
            color: '#818cf8', textAlign: 'center', padding: '0.6rem',
            borderRadius: '8px 8px 0 0', fontSize: '0.75rem', fontWeight: '600',
            letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '2rem',
          }}>
            STAGE
          </div>

          {/* Seats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
            {rows.map((row) => (
              <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '22px', fontSize: '0.75rem', color: '#404040', fontWeight: '700', textAlign: 'center' }}>{row}</span>
                {seats
                  .filter((s) => s.row === row)
                  .sort((a, b) => a.number - b.number)
                  .map((seat) => {
                    const isSelected = selectedSeat?.id === seat.id;
                    const status = isSelected ? 'SELECTED' : seat.status;
                    return (
                      <div
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        title={`${seat.row}${seat.number} • ${seat.section} • $${seat.price}`}
                        style={{
                          width: '38px', height: '34px',
                          background: SEAT_COLORS[status],
                          border: `1.5px solid ${SEAT_BORDERS[status]}`,
                          borderRadius: '5px 5px 8px 8px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: seat.status === 'AVAILABLE' ? 'pointer' : 'not-allowed',
                          fontSize: '0.65rem', fontWeight: '600',
                          color: isSelected ? '#818cf8' : seat.status === 'AVAILABLE' ? '#4ade80' : '#404040',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {seat.number}
                      </div>
                    );
                  })}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2rem', fontSize: '0.8rem', color: '#525252' }}>
            {[
              { color: SEAT_BORDERS.AVAILABLE, label: 'Available' },
              { color: SEAT_BORDERS.SELECTED, label: 'Selected' },
              { color: SEAT_BORDERS.HELD, label: 'Held' },
              { color: SEAT_BORDERS.BOOKED, label: 'Booked' },
            ].map((item) => (
              <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '10px', height: '10px', background: item.color, borderRadius: '2px', display: 'inline-block' }} />
                {item.label}
              </span>
            ))}
          </div>

          {error && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}

          {/* Selection Panel */}
          {selectedSeat && (
            <div style={{
              marginTop: '2rem', padding: '1.25rem', background: '#141414',
              borderRadius: '12px', border: '1px solid #312e81',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <div>
                <p style={{ color: '#818cf8', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>SELECTED SEAT</p>
                <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700' }}>
                  {selectedSeat.row}{selectedSeat.number}
                  <span style={{ color: '#525252', fontWeight: '400', fontSize: '0.85rem', marginLeft: '0.75rem' }}>
                    {selectedSeat.section} Section
                  </span>
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '800' }}>${selectedSeat.price}</p>
                <button onClick={handleBooking} disabled={submitting} style={{ padding: '0.65rem 1.75rem', fontSize: '0.9rem', fontWeight: '600' }}>
                  {submitting ? 'Booking...' : 'Book Now'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BookingPage;
