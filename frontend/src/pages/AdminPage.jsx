import { useState } from 'react';
import api from '../api/axios';

function AdminPage() {
  const [eventForm, setEventForm] = useState({
    title: '', description: '', eventDate: '', eventTime: '',
    venue: '', city: '', category: 'concert', minPrice: '', maxPrice: '',
  });
  const [createdEvent, setCreatedEvent] = useState(null);
  const [seatSections, setSeatSections] = useState([
    { name: 'Premium', rows: 'A,B', seatsPerRow: 10, price: '' },
    { name: 'Standard', rows: 'C,D', seatsPerRow: 10, price: '' },
  ]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEventChange = (e) => setEventForm({ ...eventForm, [e.target.name]: e.target.value });

  const handleSectionChange = (index, field, value) => {
    const updated = [...seatSections];
    updated[index][field] = value;
    setSeatSections(updated);
  };

  const addSection = () => setSeatSections([...seatSections, { name: '', rows: '', seatsPerRow: 10, price: '' }]);
  const removeSection = (index) => setSeatSections(seatSections.filter((_, i) => i !== index));

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const data = {
        ...eventForm,
        eventDate: new Date(eventForm.eventDate).toISOString(),
        minPrice: parseFloat(eventForm.minPrice),
        maxPrice: parseFloat(eventForm.maxPrice),
        totalSeats: 0,
      };
      const res = await api.post('/events', data);
      setCreatedEvent(res.data.event);
      setMessage(`Event "${res.data.event.title}" created! Now add seats below.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleAddSeats = async () => {
    if (!createdEvent) return;
    setError('');
    try {
      const sections = seatSections.map((s) => ({
        name: s.name,
        rows: s.rows.split(',').map((r) => r.trim().toUpperCase()),
        seatsPerRow: parseInt(s.seatsPerRow),
        price: parseFloat(s.price),
      }));
      const res = await api.post(`/events/${createdEvent.id}/seats`, { sections });
      setMessage(`Seats added! Total: ${res.data.event.totalSeats} seats`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add seats');
    }
  };

  return (
    <div style={{ padding: '3rem', maxWidth: '700px', margin: '0 auto' }}>
      <p style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>ADMIN PANEL</p>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', marginBottom: '2rem' }}>Create Event</h1>

      {message && (
        <div style={{ background: '#1a2e1a', border: '1px solid #166534', color: '#4ade80', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ background: '#2e1a1a', border: '1px solid #991b1b', color: '#f87171', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleCreateEvent} style={{
        background: '#141414', padding: '1.75rem', borderRadius: '12px', border: '1px solid #1f1f1f', marginBottom: '1.5rem',
      }}>
        <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Event Details</h3>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>Title</label>
          <input name="title" value={eventForm.title} onChange={handleEventChange} required placeholder="Event title" />
        </div>
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>Description</label>
          <textarea name="description" value={eventForm.description} onChange={handleEventChange} required placeholder="Event description" style={{ height: '80px', resize: 'vertical' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>Date</label>
            <input name="eventDate" type="date" value={eventForm.eventDate} onChange={handleEventChange} required />
          </div>
          <div>
            <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>Time</label>
            <input name="eventTime" value={eventForm.eventTime} onChange={handleEventChange} required placeholder="e.g. 7:00 PM" />
          </div>
          <div>
            <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>Venue</label>
            <input name="venue" value={eventForm.venue} onChange={handleEventChange} required placeholder="Venue name" />
          </div>
          <div>
            <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>City</label>
            <input name="city" value={eventForm.city} onChange={handleEventChange} required placeholder="City" />
          </div>
          <div>
            <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>Category</label>
            <select name="category" value={eventForm.category} onChange={handleEventChange}>
              <option value="concert">Concert</option>
              <option value="sports">Sports</option>
              <option value="theater">Theater</option>
              <option value="comedy">Comedy</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div />
          <div>
            <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>Min Price ($)</label>
            <input name="minPrice" type="number" value={eventForm.minPrice} onChange={handleEventChange} required placeholder="0" />
          </div>
          <div>
            <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>Max Price ($)</label>
            <input name="maxPrice" type="number" value={eventForm.maxPrice} onChange={handleEventChange} required placeholder="0" />
          </div>
        </div>
        <button type="submit" disabled={!!createdEvent} style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', fontWeight: '600', marginTop: '0.5rem' }}>
          {createdEvent ? '✓ Event Created' : 'Create Event'}
        </button>
      </form>

      {createdEvent && (
        <div style={{
          background: '#141414', padding: '1.75rem', borderRadius: '12px', border: '1px solid #1f1f1f',
        }}>
          <h3 style={{ color: '#fff', fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Add Seat Sections</h3>

          {seatSections.map((section, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 0.6fr 0.8fr auto', gap: '0.5rem',
              marginBottom: '0.75rem', alignItems: 'end',
            }}>
              <div>
                {i === 0 && <label style={{ display: 'block', color: '#404040', fontSize: '0.7rem', marginBottom: '0.25rem' }}>Name</label>}
                <input placeholder="Premium" value={section.name} onChange={(e) => handleSectionChange(i, 'name', e.target.value)} />
              </div>
              <div>
                {i === 0 && <label style={{ display: 'block', color: '#404040', fontSize: '0.7rem', marginBottom: '0.25rem' }}>Rows</label>}
                <input placeholder="A,B,C" value={section.rows} onChange={(e) => handleSectionChange(i, 'rows', e.target.value)} />
              </div>
              <div>
                {i === 0 && <label style={{ display: 'block', color: '#404040', fontSize: '0.7rem', marginBottom: '0.25rem' }}>Per Row</label>}
                <input type="number" value={section.seatsPerRow} onChange={(e) => handleSectionChange(i, 'seatsPerRow', e.target.value)} />
              </div>
              <div>
                {i === 0 && <label style={{ display: 'block', color: '#404040', fontSize: '0.7rem', marginBottom: '0.25rem' }}>Price ($)</label>}
                <input type="number" placeholder="0" value={section.price} onChange={(e) => handleSectionChange(i, 'price', e.target.value)} />
              </div>
              <button onClick={() => removeSection(i)} style={{ background: '#7f1d1d', padding: '0.55rem 0.75rem', fontSize: '0.75rem', marginBottom: '1px' }}>✕</button>
            </div>
          ))}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
            <button onClick={addSection} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#1f1f1f', color: '#a3a3a3' }}>+ Add Section</button>
            <button onClick={handleAddSeats} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Save Seats</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
