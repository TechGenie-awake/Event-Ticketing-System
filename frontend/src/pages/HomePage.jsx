import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function HomePage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/events').then((res) => setEvents(res.data.events.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: '8rem 3rem 6rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0a 70%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <p style={{ color: '#6366f1', fontSize: '0.8rem', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
          YOUR TICKET TO UNFORGETTABLE MOMENTS
        </p>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: '900',
          color: '#fff',
          lineHeight: 1.05,
          letterSpacing: '-2px',
          marginBottom: '1.5rem',
        }}>
          GET READY TO<br />
          <span style={{ color: '#6366f1' }}>EXPERIENCE</span> THE<br />
          BEST EVENTS
        </h1>
        <p style={{ color: '#737373', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          Discover concerts, sports, theater and more. Book your seats with confidence — no double bookings, ever.
        </p>
        <Link to="/events">
          <button style={{ padding: '0.85rem 2.5rem', fontSize: '1rem', fontWeight: '600', borderRadius: '8px' }}>
            Browse Events
          </button>
        </Link>
      </section>

      {/* Stats */}
      <section style={{
        display: 'flex', justifyContent: 'center', gap: '4rem',
        padding: '3rem', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a',
      }}>
        {[
          { num: '100+', label: 'Events Hosted' },
          { num: '50K+', label: 'Tickets Sold' },
          { num: '0', label: 'Double Bookings' },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: '#fff' }}>{s.num}</p>
            <p style={{ color: '#525252', fontSize: '0.8rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.25rem' }}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* Featured Events */}
      {events.length > 0 && (
        <section style={{ padding: '4rem 3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <p style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>UPCOMING</p>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', letterSpacing: '-1px' }}>Featured Events</h2>
            </div>
            <Link to="/events" style={{ color: '#6366f1', fontSize: '0.85rem', fontWeight: '500' }}>View All →</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {events.map((event) => (
              <Link to={`/booking/${event.id}`} key={event.id} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px',
                  padding: '1.5rem', transition: 'all 0.3s ease', cursor: 'pointer',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <span style={{
                      background: '#1e1b4b', color: '#818cf8', padding: '0.25rem 0.7rem',
                      borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase',
                    }}>
                      {event.category}
                    </span>
                    <span style={{ color: '#6366f1', fontWeight: '700', fontSize: '1.1rem' }}>
                      ${event.minPrice}
                    </span>
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{event.title}</h3>
                  <p style={{ color: '#525252', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                    {new Date(event.eventDate).toDateString()} • {event.eventTime}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#525252', fontSize: '0.8rem' }}>{event.venue}, {event.city}</p>
                    <p style={{ color: event.availableSeats > 0 ? '#22c55e' : '#ef4444', fontSize: '0.8rem', fontWeight: '600' }}>
                      {event.availableSeats > 0 ? `${event.availableSeats} left` : 'Sold Out'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{
        padding: '3rem', borderTop: '1px solid #1a1a1a', textAlign: 'center',
        color: '#404040', fontSize: '0.8rem',
      }}>
        <p>© 2026 EventTickets. Built as an end-semester project.</p>
      </footer>
    </div>
  );
}

export default HomePage;
