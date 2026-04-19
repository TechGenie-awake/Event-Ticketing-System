import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/auth/profile'),
      api.get('/bookings'),
      api.get('/tickets'),
    ])
      .then(([profileRes, bookingsRes, ticketsRes]) => {
        setUser(profileRes.data.user);
        setBookings(bookingsRes.data.bookings || []);
        setTickets(ticketsRes.data.tickets || []);
      })
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: '3rem', color: '#525252' }}>Loading profile...</p>;
  if (error) return <p style={{ padding: '3rem', color: '#ef4444' }}>{error}</p>;
  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const totalSpent = bookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0);
  const activeTickets = tickets.filter((t) => t.status === 'ACTIVE').length;

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <div style={{ padding: '3rem', maxWidth: '900px', margin: '0 auto' }}>
      <p style={{ color: '#6366f1', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>ACCOUNT</p>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', marginBottom: '2rem' }}>My Profile</h1>

      {/* Profile Card */}
      <div style={{
        background: '#141414', border: '1px solid #1f1f1f', borderRadius: '16px',
        padding: '2rem', marginBottom: '1.5rem', display: 'flex', gap: '1.75rem', alignItems: 'center',
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #818cf8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-1px',
          flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h2 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px' }}>{user.name}</h2>
            {user.role === 'ADMIN' && (
              <span style={{
                background: 'rgba(99,102,241,0.15)', color: '#818cf8',
                border: '1px solid rgba(99,102,241,0.35)',
                padding: '0.15rem 0.6rem', borderRadius: '20px',
                fontSize: '0.65rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
              }}>
                Admin
              </span>
            )}
          </div>
          <p style={{ color: '#737373', fontSize: '0.9rem' }}>{user.email}</p>
          <p style={{ color: '#525252', fontSize: '0.8rem', marginTop: '0.4rem' }}>Member since {memberSince}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem', marginBottom: '2rem',
      }}>
        {[
          { label: 'Total Bookings', value: bookings.length, color: '#818cf8' },
          { label: 'Confirmed', value: confirmedBookings, color: '#4ade80' },
          { label: 'Active Tickets', value: activeTickets, color: '#f59e0b' },
          { label: 'Total Spent', value: `₹${totalSpent}`, color: '#fff' },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: '#141414', border: '1px solid #1f1f1f', borderRadius: '12px',
            padding: '1.25rem',
          }}>
            <p style={{ color: '#525252', fontSize: '0.7rem', fontWeight: '600', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              {stat.label}
            </p>
            <p style={{ color: stat.color, fontSize: '1.75rem', fontWeight: '800' }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Details Section */}
      <div style={{
        background: '#141414', border: '1px solid #1f1f1f', borderRadius: '16px',
        padding: '1.75rem', marginBottom: '1.5rem',
      }}>
        <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '700', marginBottom: '1.25rem' }}>Account Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { label: 'FULL NAME', value: user.name },
            { label: 'EMAIL', value: user.email },
            { label: 'PHONE', value: user.phone || 'Not provided' },
            { label: 'ROLE', value: user.role },
          ].map((item) => (
            <div key={item.label} style={{
              background: '#0a0a0a', border: '1px solid #1a1a1a', borderRadius: '8px', padding: '1rem',
            }}>
              <p style={{ color: '#404040', fontSize: '0.65rem', fontWeight: '600', letterSpacing: '1.5px', marginBottom: '0.35rem' }}>{item.label}</p>
              <p style={{ color: '#e5e5e5', fontWeight: '600', fontSize: '0.9rem', wordBreak: 'break-word' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Link to="/my-bookings" style={{ flex: 1, minWidth: '200px' }}>
          <button style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem', fontWeight: '600' }}>
            View My Bookings →
          </button>
        </Link>
        <Link to="/my-tickets" style={{ flex: 1, minWidth: '200px' }}>
          <button style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem', fontWeight: '600', background: '#1f1f1f', color: '#e5e5e5' }}>
            View My Tickets →
          </button>
        </Link>
      </div>
    </div>
  );
}

export default ProfilePage;
