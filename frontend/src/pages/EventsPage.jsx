import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({ category: '', city: '' });

  const loadEvents = () => {
    const params = {};
    if (filter.category) params.category = filter.category;
    if (filter.city) params.city = filter.city;

    api.get('/events', { params })
      .then((res) => setEvents(res.data.events))
      .catch(() => setError('Failed to load events'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  if (loading) return <p style={{ padding: '2rem' }}>Loading events...</p>;
  if (error) return <p style={{ padding: '2rem', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Upcoming Events</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          placeholder="Filter by city"
          value={filter.city}
          onChange={(e) => setFilter({ ...filter, city: e.target.value })}
          style={{ maxWidth: '200px' }}
        />
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">All Categories</option>
          <option value="concert">Concert</option>
          <option value="sports">Sports</option>
          <option value="theater">Theater</option>
          <option value="comedy">Comedy</option>
        </select>
        <button onClick={loadEvents} style={{ padding: '0.5rem 1rem' }}>Search</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {events.map((event) => (
          <div key={event.id} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{event.title}</h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              {new Date(event.eventDate).toDateString()} • {event.eventTime}
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>{event.venue}, {event.city}</p>
            <p style={{ margin: '0.5rem 0', fontWeight: '500' }}>From ${event.minPrice}</p>
            <p style={{ color: event.availableSeats > 0 ? '#16a34a' : '#dc2626', fontSize: '0.85rem' }}>
              {event.availableSeats > 0 ? `${event.availableSeats} seats available` : 'Sold Out'}
            </p>
            <Link to={`/booking/${event.id}`}>
              <button
                disabled={event.availableSeats === 0}
                style={{ marginTop: '1rem', width: '100%', padding: '0.6rem' }}
              >
                Book Now
              </button>
            </Link>
          </div>
        ))}
        {events.length === 0 && <p style={{ color: '#6b7280' }}>No events found.</p>}
      </div>
    </div>
  );
}

export default EventsPage;
