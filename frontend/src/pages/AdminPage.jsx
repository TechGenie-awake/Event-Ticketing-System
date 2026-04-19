import { useState, useEffect } from 'react';
import api from '../api/axios';

const EMPTY_EVENT = {
  title: '', description: '', eventDate: '', eventTime: '',
  venue: '', city: '', category: 'concert', minPrice: '', maxPrice: '',
  imageUrl: '',
};

const EMPTY_SECTIONS = [
  { name: 'Premium', rows: 'A,B', seatsPerRow: 10, price: '' },
  { name: 'Standard', rows: 'C,D', seatsPerRow: 10, price: '' },
];

function Stat({ label, value, color = '#fff' }) {
  return (
    <div style={{
      background: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px',
      padding: '1.25rem',
    }}>
      <p style={{ color: '#525252', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</p>
      <p style={{ color, fontSize: '1.75rem', fontWeight: '800' }}>{value}</p>
    </div>
  );
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Event editor state
  const [editingId, setEditingId] = useState(null); // null=closed, 'new'=creating, or event id
  const [eventForm, setEventForm] = useState(EMPTY_EVENT);
  const [seatSections, setSeatSections] = useState(EMPTY_SECTIONS);
  const [showSeatEditor, setShowSeatEditor] = useState(false);
  const [activeEventId, setActiveEventId] = useState(null);

  const reload = () => {
    setLoading(true);
    Promise.all([api.get('/events'), api.get('/users')])
      .then(([ev, us]) => {
        setEvents(ev.data.events || []);
        setUsers(us.data.users || []);
      })
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, []);

  const clearMessages = () => { setMessage(''); setError(''); };

  const startCreate = () => {
    clearMessages();
    setEditingId('new');
    setEventForm(EMPTY_EVENT);
    setShowSeatEditor(false);
    setActiveEventId(null);
  };

  const startEdit = (event) => {
    clearMessages();
    setEditingId(event.id);
    setEventForm({
      title: event.title || '',
      description: event.description || '',
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().substring(0, 10) : '',
      eventTime: event.eventTime || '',
      venue: event.venue || '',
      city: event.city || '',
      category: event.category || 'concert',
      minPrice: event.minPrice ?? '',
      maxPrice: event.maxPrice ?? '',
      imageUrl: event.imageUrl || '',
    });
    setShowSeatEditor(false);
    setActiveEventId(event.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowSeatEditor(false);
    setActiveEventId(null);
    setEventForm(EMPTY_EVENT);
  };

  const handleEventChange = (e) => setEventForm({ ...eventForm, [e.target.name]: e.target.value });

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    clearMessages();
    try {
      const data = {
        ...eventForm,
        eventDate: new Date(eventForm.eventDate).toISOString(),
        minPrice: parseFloat(eventForm.minPrice),
        maxPrice: parseFloat(eventForm.maxPrice),
      };

      if (editingId === 'new') {
        data.totalSeats = 0;
        const res = await api.post('/events', data);
        setMessage(`Event "${res.data.event.title}" created. Add seats below.`);
        setActiveEventId(res.data.event.id);
        setEditingId(res.data.event.id);
        setShowSeatEditor(true);
        setSeatSections(EMPTY_SECTIONS);
      } else {
        const res = await api.put(`/events/${editingId}`, data);
        setMessage(`Event "${res.data.event.title}" updated.`);
        reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    clearMessages();
    try {
      await api.delete(`/events/${id}`);
      setMessage('Event deleted.');
      cancelEdit();
      reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleSectionChange = (i, field, value) => {
    const updated = [...seatSections];
    updated[i][field] = value;
    setSeatSections(updated);
  };
  const addSection = () => setSeatSections([...seatSections, { name: '', rows: '', seatsPerRow: 10, price: '' }]);
  const removeSection = (i) => setSeatSections(seatSections.filter((_, idx) => idx !== i));

  const handleAddSeats = async () => {
    if (!activeEventId) return;
    clearMessages();
    try {
      const sections = seatSections.map((s) => ({
        name: s.name,
        rows: s.rows.split(',').map((r) => r.trim().toUpperCase()).filter(Boolean),
        seatsPerRow: parseInt(s.seatsPerRow),
        price: parseFloat(s.price),
      }));
      const res = await api.post(`/events/${activeEventId}/seats`, { sections });
      setMessage(`Seats saved. Event now has ${res.data.event.totalSeats} seats.`);
      reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add seats');
    }
  };

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (!window.confirm(`Change ${user.email} from ${user.role} to ${newRole}?`)) return;
    clearMessages();
    try {
      await api.put(`/users/${user.id}/role`, { role: newRole });
      setMessage(`${user.email} is now ${newRole}.`);
      reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
    }
  };

  if (loading) return <p style={{ padding: '3rem', color: '#525252' }}>Loading dashboard...</p>;

  const totalBookings = events.reduce((sum, ev) => sum + ((ev.totalSeats || 0) - (ev.availableSeats || 0)), 0);
  const adminCount = users.filter((u) => u.role === 'ADMIN').length;

  return (
    <div style={{ padding: '3rem', maxWidth: '1100px', margin: '0 auto' }}>
      <p style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>ADMIN DASHBOARD</p>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', marginBottom: '2rem' }}>Control Panel</h1>

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

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: '0.25rem', marginBottom: '2rem',
        borderBottom: '1px solid #1f1f1f',
      }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'events', label: `Events (${events.length})` },
          { id: 'users', label: `Users (${users.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); clearMessages(); }}
            style={{
              padding: '0.65rem 1.25rem', background: 'transparent', border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #6366f1' : '2px solid transparent',
              color: activeTab === tab.id ? '#fff' : '#737373',
              fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
              borderRadius: 0, marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem', marginBottom: '2rem',
          }}>
            <Stat label="Total Events" value={events.length} color="#818cf8" />
            <Stat label="Total Users" value={users.length} color="#4ade80" />
            <Stat label="Admins" value={adminCount} color="#f59e0b" />
            <Stat label="Seats Booked" value={totalBookings} />
          </div>

          <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '700', marginBottom: '1rem' }}>Recent Users</h3>
          <div style={{ background: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
            {users.slice(0, 5).map((u, i) => (
              <div key={u.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.9rem 1.25rem',
                borderTop: i === 0 ? 'none' : '1px solid #1a1a1a',
              }}>
                <div>
                  <p style={{ color: '#e5e5e5', fontWeight: '600', fontSize: '0.9rem' }}>{u.name}</p>
                  <p style={{ color: '#525252', fontSize: '0.8rem' }}>{u.email}</p>
                </div>
                <span style={{
                  fontSize: '0.7rem', fontWeight: '600', padding: '0.2rem 0.6rem', borderRadius: '20px',
                  color: u.role === 'ADMIN' ? '#818cf8' : '#737373',
                  background: u.role === 'ADMIN' ? 'rgba(99,102,241,0.15)' : '#1f1f1f',
                }}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EVENTS */}
      {activeTab === 'events' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '700' }}>All Events</h3>
            {editingId === null && (
              <button onClick={startCreate} style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', fontWeight: '600' }}>
                + New Event
              </button>
            )}
          </div>

          {/* Event list */}
          {editingId === null && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {events.length === 0 && (
                <p style={{ color: '#525252', padding: '1rem' }}>No events yet. Click "+ New Event" to create one.</p>
              )}
              {events.map((event) => (
                <div key={event.id} style={{
                  background: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px',
                  padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem',
                }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', minWidth: 0, flex: 1 }}>
                    {event.imageUrl && (
                      <img src={event.imageUrl} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <p style={{ color: '#fff', fontWeight: '600', fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</p>
                      <p style={{ color: '#525252', fontSize: '0.8rem' }}>
                        {new Date(event.eventDate).toLocaleDateString()} • {event.venue}, {event.city} • {event.availableSeats}/{event.totalSeats} left
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button onClick={() => startEdit(event)} style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', background: '#1f1f1f', color: '#e5e5e5' }}>Edit</button>
                    <button onClick={() => handleDeleteEvent(event.id)} style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', background: '#3b1323', color: '#f87171' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Event editor form */}
          {editingId !== null && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700' }}>
                  {editingId === 'new' ? 'Create New Event' : 'Edit Event'}
                </h4>
                <button onClick={cancelEdit} style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', background: '#1f1f1f', color: '#a3a3a3' }}>✕ Close</button>
              </div>
              <form onSubmit={handleSaveEvent} style={{
                background: '#141414', padding: '1.75rem', borderRadius: '12px', border: '1px solid #1f1f1f', marginBottom: '1.5rem',
              }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>Title</label>
                  <input name="title" value={eventForm.title} onChange={handleEventChange} required placeholder="Event title" />
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>Description</label>
                  <textarea name="description" value={eventForm.description} onChange={handleEventChange} required style={{ height: '80px', resize: 'vertical' }} />
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>Image URL (optional)</label>
                  <input name="imageUrl" value={eventForm.imageUrl} onChange={handleEventChange} placeholder="https://..." />
                  {eventForm.imageUrl && (
                    <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #1f1f1f', maxWidth: '280px' }}>
                      <img src={eventForm.imageUrl} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  )}
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
                    <input name="venue" value={eventForm.venue} onChange={handleEventChange} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>City</label>
                    <input name="city" value={eventForm.city} onChange={handleEventChange} required />
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
                    <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>Min Price (₹)</label>
                    <input name="minPrice" type="number" value={eventForm.minPrice} onChange={handleEventChange} required placeholder="0" />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#525252', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.35rem' }}>Max Price (₹)</label>
                    <input name="maxPrice" type="number" value={eventForm.maxPrice} onChange={handleEventChange} required placeholder="0" />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <button type="submit" style={{ padding: '0.65rem 1.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                    {editingId === 'new' ? 'Create Event' : 'Save Changes'}
                  </button>
                  {editingId !== 'new' && (
                    <button type="button" onClick={() => setShowSeatEditor(!showSeatEditor)} style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', background: '#1f1f1f', color: '#e5e5e5' }}>
                      {showSeatEditor ? 'Hide' : 'Manage'} Seats
                    </button>
                  )}
                </div>
              </form>

              {/* Seat editor */}
              {showSeatEditor && activeEventId && (
                <div style={{
                  background: '#141414', padding: '1.75rem', borderRadius: '12px', border: '1px solid #1f1f1f',
                }}>
                  <h4 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.35rem' }}>Add Seat Sections</h4>
                  <p style={{ color: '#525252', fontSize: '0.8rem', marginBottom: '1.25rem' }}>Existing seats with the same row and number will be skipped — only new seats are added.</p>

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
                        {i === 0 && <label style={{ display: 'block', color: '#404040', fontSize: '0.7rem', marginBottom: '0.25rem' }}>Price (₹)</label>}
                        <input type="number" placeholder="0" value={section.price} onChange={(e) => handleSectionChange(i, 'price', e.target.value)} />
                      </div>
                      <button type="button" onClick={() => removeSection(i)} style={{ background: '#7f1d1d', padding: '0.55rem 0.75rem', fontSize: '0.75rem', marginBottom: '1px' }}>✕</button>
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.25rem' }}>
                    <button type="button" onClick={addSection} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: '#1f1f1f', color: '#a3a3a3' }}>+ Add Section</button>
                    <button type="button" onClick={handleAddSeats} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Save Seats</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* USERS */}
      {activeTab === 'users' && (
        <div>
          <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '700', marginBottom: '1rem' }}>All Users</h3>
          <div style={{ background: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px', overflow: 'hidden' }}>
            {users.length === 0 && <p style={{ color: '#525252', padding: '1rem' }}>No users found.</p>}
            {users.map((u, i) => (
              <div key={u.id} style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.25rem',
                borderTop: i === 0 ? 'none' : '1px solid #1a1a1a',
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: '0.85rem', fontWeight: '700', flexShrink: 0,
                }}>
                  {u.name?.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#e5e5e5', fontWeight: '600', fontSize: '0.9rem' }}>{u.name}</p>
                  <p style={{ color: '#525252', fontSize: '0.8rem' }}>{u.email}{u.phone ? ` • ${u.phone}` : ''}</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#525252' }}>
                  <p>{u._count?.bookings || 0} bookings</p>
                  <p>{u._count?.tickets || 0} tickets</p>
                </div>
                <span style={{
                  fontSize: '0.7rem', fontWeight: '600', padding: '0.2rem 0.6rem', borderRadius: '20px',
                  color: u.role === 'ADMIN' ? '#818cf8' : '#737373',
                  background: u.role === 'ADMIN' ? 'rgba(99,102,241,0.15)' : '#1f1f1f',
                  minWidth: '55px', textAlign: 'center',
                }}>
                  {u.role}
                </span>
                <button onClick={() => handleRoleToggle(u)} style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem', background: '#1f1f1f', color: '#e5e5e5' }}>
                  Make {u.role === 'ADMIN' ? 'User' : 'Admin'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
