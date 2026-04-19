import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const CATEGORY_GRADIENTS = {
  concert: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
  sports: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)',
  comedy: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #92400e 100%)',
  theater: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #991b1b 100%)',
  other: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
};

function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/${id}`)
      .then((res) => setEvent(res.data.event))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: '3rem', color: '#525252' }}>Loading...</p>;
  if (!event) return <p style={{ padding: '3rem', color: '#ef4444' }}>Event not found.</p>;

  const gradient = CATEGORY_GRADIENTS[event.category] || CATEGORY_GRADIENTS.other;
  const availableSeats = event.seats?.filter((s) => s.status === 'AVAILABLE') || [];
  const sections = [...new Set(event.seats?.map((s) => s.section) || [])];

  return (
    <div>
      {/* Hero */}
      <div style={{ position: 'relative', height: '480px', overflow: 'hidden' }}>
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
          />
        ) : null}
        <div style={{
          position: 'absolute', inset: 0,
          background: event.imageUrl
            ? 'linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.3) 100%)'
            : gradient,
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '3rem',
        }}>
          <span style={{
            display: 'inline-block', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)',
            color: '#818cf8', padding: '0.3rem 0.85rem', borderRadius: '20px',
            fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px',
            marginBottom: '1rem',
          }}>
            {event.category}
          </span>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '900', color: '#fff',
            lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '1rem', maxWidth: '700px',
          }}>
            {event.title}
          </h1>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', color: '#a3a3a3', fontSize: '0.95rem' }}>
            <span>📅 {new Date(event.eventDate).toDateString()}</span>
            <span>🕐 {event.eventTime}</span>
            <span>📍 {event.venue}, {event.city}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '3rem' }}>
          {/* Left - Details */}
          <div>
            <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem' }}>About This Event</h2>
            <p style={{ color: '#737373', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              {event.description}
            </p>

            {/* Event Info Grid */}
            <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.25rem' }}>Event Details</h2>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem',
            }}>
              {[
                { label: 'DATE', value: new Date(event.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), icon: '📅' },
                { label: 'TIME', value: event.eventTime, icon: '🕐' },
                { label: 'VENUE', value: event.venue, icon: '🏟️' },
                { label: 'CITY', value: event.city, icon: '📍' },
              ].map((item) => (
                <div key={item.label} style={{
                  background: '#141414', border: '1px solid #1f1f1f', borderRadius: '10px', padding: '1.25rem',
                }}>
                  <p style={{ color: '#404040', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '1.5px', marginBottom: '0.4rem' }}>{item.label}</p>
                  <p style={{ color: '#e5e5e5', fontWeight: '600', fontSize: '0.95rem' }}>{item.icon} {item.value}</p>
                </div>
              ))}
            </div>

            {/* Seat Sections */}
            {sections.length > 0 && (
              <>
                <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.25rem' }}>Seating Sections</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {sections.map((section) => {
                    const sectionSeats = event.seats.filter((s) => s.section === section);
                    const available = sectionSeats.filter((s) => s.status === 'AVAILABLE').length;
                    const price = sectionSeats[0]?.price;
                    return (
                      <div key={section} style={{
                        background: '#141414', border: '1px solid #1f1f1f', borderRadius: '10px',
                        padding: '1.25rem', flex: '1', minWidth: '150px',
                      }}>
                        <p style={{ color: '#6366f1', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{section}</p>
                        <p style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.25rem' }}>₹{price}</p>
                        <p style={{
                          fontSize: '0.8rem', fontWeight: '500',
                          color: available > 5 ? '#22c55e' : available > 0 ? '#f59e0b' : '#ef4444',
                        }}>
                          {available} / {sectionSeats.length} available
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Right - Booking Card */}
          <div>
            <div style={{
              background: '#141414', border: '1px solid #1f1f1f', borderRadius: '16px',
              padding: '2rem', position: 'sticky', top: '100px',
            }}>
              <p style={{ color: '#404040', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>STARTING FROM</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#fff', fontSize: '2.5rem', fontWeight: '900' }}>₹{event.minPrice}</span>
                {event.minPrice !== event.maxPrice && (
                  <span style={{ color: '#525252', fontSize: '0.9rem' }}>— ₹{event.maxPrice}</span>
                )}
              </div>
              <p style={{ color: '#525252', fontSize: '0.8rem', marginBottom: '1.5rem' }}>per ticket</p>

              <div style={{
                background: '#0a0a0a', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem',
                border: '1px solid #1a1a1a',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#737373', fontSize: '0.85rem' }}>Available Seats</span>
                  <span style={{ color: '#fff', fontWeight: '700' }}>{availableSeats.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#737373', fontSize: '0.85rem' }}>Total Capacity</span>
                  <span style={{ color: '#fff', fontWeight: '700' }}>{event.totalSeats}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#737373', fontSize: '0.85rem' }}>Status</span>
                  <span style={{
                    fontWeight: '600', fontSize: '0.85rem',
                    color: availableSeats.length > 0 ? '#22c55e' : '#ef4444',
                  }}>
                    {availableSeats.length > 0 ? 'On Sale' : 'Sold Out'}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: '#525252', fontSize: '0.75rem' }}>Sold</span>
                  <span style={{ color: '#525252', fontSize: '0.75rem' }}>
                    {Math.round(((event.totalSeats - availableSeats.length) / event.totalSeats) * 100)}%
                  </span>
                </div>
                <div style={{ height: '4px', background: '#1f1f1f', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '2px',
                    background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                    width: `${((event.totalSeats - availableSeats.length) / event.totalSeats) * 100}%`,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>

              <Link to={`/booking/${event.id}`}>
                <button disabled={availableSeats.length === 0} style={{
                  width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: '700',
                  borderRadius: '10px',
                }}>
                  {availableSeats.length > 0 ? 'Select Seats & Book' : 'Sold Out'}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsPage;
