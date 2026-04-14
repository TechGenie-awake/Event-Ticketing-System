import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ category: '', city: '' });

  const loadEvents = () => {
    setLoading(true);
    const params = {};
    if (filter.category) params.category = filter.category;
    if (filter.city) params.city = filter.city;

    api.get('/events', { params })
      .then((res) => setEvents(res.data.events))
      .catch(() => setError('Failed to load events'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadEvents(); }, []);

  return (
    <div style={{ padding: '3rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <p style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>DISCOVER</p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', letterSpacing: '-1px' }}>All Events</h1>
      </div>

      <div style={{
        display: 'flex', gap: '0.75rem', marginBottom: '2rem',
        padding: '1rem', background: '#141414', borderRadius: '10px', border: '1px solid #1f1f1f',
      }}>
        <input
          placeholder="Search by city..."
          value={filter.city}
          onChange={(e) => setFilter({ ...filter, city: e.target.value })}
          style={{ maxWidth: '220px' }}
        />
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          style={{ maxWidth: '180px' }}
        >
          <option value="">All Categories</option>
          <option value="concert">Concert</option>
          <option value="sports">Sports</option>
          <option value="theater">Theater</option>
          <option value="comedy">Comedy</option>
        </select>
        <button onClick={loadEvents} style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Search</button>
      </div>

      {loading && <p style={{ color: '#525252' }}>Loading events...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {events.map((event) => (
          <div key={event.id} style={{
            background: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px',
            padding: '1.5rem', transition: 'border-color 0.2s',
          }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#2a2a2a'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1f1f1f'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{
                background: '#1e1b4b', color: '#818cf8', padding: '0.2rem 0.65rem',
                borderRadius: '20px', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase',
              }}>
                {event.category}
              </span>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>
                  ${event.minPrice}
                  {event.minPrice !== event.maxPrice && <span style={{ color: '#525252', fontSize: '0.75rem', fontWeight: '400' }}> - ${event.maxPrice}</span>}
                </p>
              </div>
            </div>

            <h3 style={{ color: '#fff', fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>{event.title}</h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#525252', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span>📅</span>
              <span>{new Date(event.eventDate).toDateString()} • {event.eventTime}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#525252', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <span>📍</span>
              <span>{event.venue}, {event.city}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #1f1f1f' }}>
              <p style={{
                fontSize: '0.8rem', fontWeight: '600',
                color: event.availableSeats > 10 ? '#22c55e' : event.availableSeats > 0 ? '#f59e0b' : '#ef4444',
              }}>
                {event.availableSeats > 0 ? `${event.availableSeats} seats available` : 'Sold Out'}
              </p>
              <Link to={`/booking/${event.id}`}>
                <button disabled={event.availableSeats === 0} style={{ padding: '0.45rem 1.2rem', fontSize: '0.8rem' }}>
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {!loading && events.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#404040' }}>
          <p style={{ fontSize: '1.1rem' }}>No events found.</p>
        </div>
      )}
    </div>
  );
}

export default EventsPage;
