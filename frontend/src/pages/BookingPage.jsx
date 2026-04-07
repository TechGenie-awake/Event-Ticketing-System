import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SEAT_COLORS = {
  AVAILABLE: '#bbf7d0',
  HELD: '#fde68a',
  BOOKED: '#e5e7eb',
  SELECTED: '#818cf8',
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

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>;
  if (error && !event) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  if (booking) {
    return (
      <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem', background: 'white', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#16a34a', marginBottom: '1rem' }}>Booking Created!</h2>
        <p style={{ marginBottom: '0.5rem' }}>Reference: <strong>{booking.bookingReference}</strong></p>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Complete payment within 30 minutes to confirm your seat.
        </p>
        <button onClick={() => navigate('/events')} style={{ padding: '0.6rem 1.5rem' }}>
          Back to Events
        </button>
      </div>
    );
  }

  // Group seats by row for display
  const rows = [...new Set(seats.map((s) => s.row))].sort();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      {event && (
        <>
          <h2>{event.title}</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            {new Date(event.eventDate).toDateString()} • {event.venue}, {event.city}
          </p>

          <h3 style={{ marginBottom: '1rem' }}>Select a Seat</h3>

          <div style={{ background: '#1e1b4b', color: 'white', textAlign: 'center', padding: '0.5rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            STAGE / SCREEN
          </div>

          {rows.map((row) => (
            <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <span style={{ width: '20px', fontSize: '0.8rem', color: '#6b7280', fontWeight: 'bold' }}>{row}</span>
              {seats
                .filter((s) => s.row === row)
                .sort((a, b) => a.number - b.number)
                .map((seat) => (
                  <div
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    title={`${seat.row}${seat.number} - ${seat.section} - $${seat.price}`}
                    style={{
                      width: '36px',
                      height: '36px',
                      background: selectedSeat?.id === seat.id ? SEAT_COLORS.SELECTED : SEAT_COLORS[seat.status],
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: seat.status === 'AVAILABLE' ? 'pointer' : 'not-allowed',
                      fontSize: '0.65rem',
                      fontWeight: '600',
                      border: selectedSeat?.id === seat.id ? '2px solid #4f46e5' : '1px solid #d1d5db',
                      transition: 'transform 0.1s',
                    }}
                    onMouseEnter={(e) => { if (seat.status === 'AVAILABLE') e.target.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; }}
                  >
                    {seat.number}
                  </div>
                ))}
            </div>
          ))}

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.85rem' }}>
            <span><span style={{ display: 'inline-block', width: '14px', height: '14px', background: SEAT_COLORS.AVAILABLE, borderRadius: '2px', marginRight: '4px' }}></span>Available</span>
            <span><span style={{ display: 'inline-block', width: '14px', height: '14px', background: SEAT_COLORS.SELECTED, borderRadius: '2px', marginRight: '4px' }}></span>Selected</span>
            <span><span style={{ display: 'inline-block', width: '14px', height: '14px', background: SEAT_COLORS.HELD, borderRadius: '2px', marginRight: '4px' }}></span>Held</span>
            <span><span style={{ display: 'inline-block', width: '14px', height: '14px', background: SEAT_COLORS.BOOKED, borderRadius: '2px', marginRight: '4px' }}></span>Booked</span>
          </div>

          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

          {selectedSeat && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <p>Seat: <strong>{selectedSeat.row}{selectedSeat.number}</strong> | Section: {selectedSeat.section} | Price: <strong>${selectedSeat.price}</strong></p>
              <button onClick={handleBooking} disabled={submitting} style={{ marginTop: '0.75rem', padding: '0.6rem 1.5rem' }}>
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BookingPage;
