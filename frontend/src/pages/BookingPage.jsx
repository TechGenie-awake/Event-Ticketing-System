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

const MAX_SEATS = 8;

function BookingPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState(null);
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

  const isSelected = (seatId) => selectedSeats.some((s) => s.id === seatId);

  const handleSeatClick = (seat) => {
    if (seat.status !== 'AVAILABLE') return;
    if (isSelected(seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= MAX_SEATS) {
        setError(`You can select up to ${MAX_SEATS} seats at a time.`);
        return;
      }
      setError('');
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) return;
    setSubmitting(true);
    setError('');
    const created = [];
    try {
      for (const seat of selectedSeats) {
        const res = await api.post('/bookings', { eventId, seatId: seat.id });
        created.push(res.data.booking);
      }
      setBookings(created);
    } catch (err) {
      setError(
        created.length > 0
          ? `Booked ${created.length} of ${selectedSeats.length} seats. ${err.response?.data?.message || 'Remaining seats failed.'}`
          : err.response?.data?.message || 'Booking failed. Please try again.'
      );
      if (created.length > 0) setBookings(created);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p style={{ padding: '3rem', color: '#525252' }}>Loading...</p>;
  if (error && !event) return <p style={{ padding: '3rem', color: '#ef4444' }}>{error}</p>;

  if (bookings && bookings.length > 0) {
    return (
      <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{
          maxWidth: '480px', width: '100%', padding: '2.5rem', textAlign: 'center',
          background: '#141414', borderRadius: '16px', border: '1px solid #1f1f1f',
        }}>
          <div style={{ width: '56px', height: '56px', background: '#1a2e1a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>✓</div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {bookings.length === 1 ? 'Booking Created' : `${bookings.length} Bookings Created`}
          </h2>
          <p style={{ color: '#525252', marginBottom: '1.5rem' }}>Complete payment within 30 minutes to confirm.</p>
          <div style={{ background: '#0a0a0a', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid #1f1f1f', textAlign: 'left' }}>
            {bookings.map((b) => (
              <div key={b.id} style={{ padding: '0.35rem 0', borderBottom: '1px solid #1a1a1a' }}>
                <p style={{ color: '#525252', fontSize: '0.7rem' }}>Booking Reference</p>
                <p style={{ color: '#fff', fontWeight: '600', fontSize: '0.85rem', fontFamily: 'monospace' }}>{b.bookingReference}</p>
              </div>
            ))}
          </div>
          {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
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
    <div style={{ padding: '3rem', maxWidth: '900px', margin: '0 auto', paddingBottom: '8rem' }}>
      {event && (
        <>
          <div style={{ marginBottom: '2rem' }}>
            <p style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>SELECT YOUR SEATS</p>
            <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>{event.title}</h1>
            <p style={{ color: '#525252', fontSize: '0.9rem' }}>
              {new Date(event.eventDate).toDateString()} • {event.eventTime} • {event.venue}, {event.city}
            </p>
            <p style={{ color: '#6366f1', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Tap seats to add or remove — up to {MAX_SEATS} per booking.
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
                    const selected = isSelected(seat.id);
                    const status = selected ? 'SELECTED' : seat.status;
                    return (
                      <div
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        title={`${seat.row}${seat.number} • ${seat.section} • ₹${seat.price}`}
                        style={{
                          width: '38px', height: '34px',
                          background: SEAT_COLORS[status],
                          border: `1.5px solid ${SEAT_BORDERS[status]}`,
                          borderRadius: '5px 5px 8px 8px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: seat.status === 'AVAILABLE' ? 'pointer' : 'not-allowed',
                          fontSize: '0.65rem', fontWeight: '600',
                          color: selected ? '#818cf8' : seat.status === 'AVAILABLE' ? '#4ade80' : '#404040',
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

          {/* Selection Panel - sticky bottom bar */}
          {selectedSeats.length > 0 && (
            <div style={{
              position: 'fixed', bottom: 0, left: 0, right: 0,
              background: 'rgba(20,20,20,0.98)', backdropFilter: 'blur(12px)',
              borderTop: '1px solid #312e81',
              padding: '1.25rem 2rem',
              display: 'flex', justifyContent: 'center',
              zIndex: 50,
            }}>
              <div style={{
                maxWidth: '900px', width: '100%',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap',
              }}>
                <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
                  <p style={{ color: '#818cf8', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    {selectedSeats.length} SEAT{selectedSeats.length !== 1 ? 'S' : ''} SELECTED
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {selectedSeats.map((s) => (
                      <span key={s.id} style={{
                        background: '#1e1b4b', color: '#a5b4fc', padding: '0.25rem 0.6rem',
                        borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600',
                      }}>
                        {s.row}{s.number} <span style={{ color: '#6366f1' }}>· ₹{s.price}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#525252', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total</p>
                    <p style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800' }}>₹{totalPrice}</p>
                  </div>
                  <button onClick={handleBooking} disabled={submitting} style={{ padding: '0.75rem 1.75rem', fontSize: '0.9rem', fontWeight: '600' }}>
                    {submitting ? 'Booking...' : `Book ${selectedSeats.length} Seat${selectedSeats.length !== 1 ? 's' : ''}`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BookingPage;
