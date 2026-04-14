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

  const handleEventChange = (e) => {
    setEventForm({ ...eventForm, [e.target.name]: e.target.value });
  };

  const handleSectionChange = (index, field, value) => {
    const updated = [...seatSections];
    updated[index][field] = value;
    setSeatSections(updated);
  };

  const addSection = () => {
    setSeatSections([...seatSections, { name: '', rows: '', seatsPerRow: 10, price: '' }]);
  };

  const removeSection = (index) => {
    setSeatSections(seatSections.filter((_, i) => i !== index));
  };

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
      setMessage(`Seats added! Total seats: ${res.data.event.totalSeats}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add seats');
    }
  };

  const inputStyle = { width: '100%', padding: '0.5rem', marginBottom: '0.75rem' };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Admin - Create Event</h2>

      {message && <p style={{ color: '#16a34a', marginBottom: '1rem', padding: '0.5rem', background: '#dcfce7', borderRadius: '4px' }}>{message}</p>}
      {error && <p style={{ color: '#dc2626', marginBottom: '1rem', padding: '0.5rem', background: '#fee2e2', borderRadius: '4px' }}>{error}</p>}

      <form onSubmit={handleCreateEvent} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Event Details</h3>
        <input name="title" placeholder="Event Title" value={eventForm.title} onChange={handleEventChange} required style={inputStyle} />
        <textarea name="description" placeholder="Description" value={eventForm.description} onChange={handleEventChange} required style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <input name="eventDate" type="date" value={eventForm.eventDate} onChange={handleEventChange} required style={inputStyle} />
          <input name="eventTime" placeholder="e.g. 7:00 PM" value={eventForm.eventTime} onChange={handleEventChange} required style={inputStyle} />
          <input name="venue" placeholder="Venue" value={eventForm.venue} onChange={handleEventChange} required style={inputStyle} />
          <input name="city" placeholder="City" value={eventForm.city} onChange={handleEventChange} required style={inputStyle} />
          <select name="category" value={eventForm.category} onChange={handleEventChange} style={{ ...inputStyle, background: 'white' }}>
            <option value="concert">Concert</option>
            <option value="sports">Sports</option>
            <option value="theater">Theater</option>
            <option value="comedy">Comedy</option>
            <option value="other">Other</option>
          </select>
          <div />
          <input name="minPrice" type="number" placeholder="Min Price" value={eventForm.minPrice} onChange={handleEventChange} required style={inputStyle} />
          <input name="maxPrice" type="number" placeholder="Max Price" value={eventForm.maxPrice} onChange={handleEventChange} required style={inputStyle} />
        </div>
        <button type="submit" disabled={!!createdEvent} style={{ padding: '0.6rem 1.5rem', marginTop: '0.5rem' }}>
          {createdEvent ? 'Event Created' : 'Create Event'}
        </button>
      </form>

      {createdEvent && (
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginBottom: '1rem' }}>Add Seat Sections</h3>
          {seatSections.map((section, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 0.7fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
              <input placeholder="Section Name" value={section.name} onChange={(e) => handleSectionChange(i, 'name', e.target.value)} style={{ padding: '0.4rem' }} />
              <input placeholder="Rows (A,B,C)" value={section.rows} onChange={(e) => handleSectionChange(i, 'rows', e.target.value)} style={{ padding: '0.4rem' }} />
              <input type="number" placeholder="Per Row" value={section.seatsPerRow} onChange={(e) => handleSectionChange(i, 'seatsPerRow', e.target.value)} style={{ padding: '0.4rem' }} />
              <input type="number" placeholder="Price" value={section.price} onChange={(e) => handleSectionChange(i, 'price', e.target.value)} style={{ padding: '0.4rem' }} />
              <button onClick={() => removeSection(i)} style={{ background: '#ef4444', padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}>X</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button onClick={addSection} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: '#6b7280' }}>+ Add Section</button>
            <button onClick={handleAddSeats} style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Save Seats</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
