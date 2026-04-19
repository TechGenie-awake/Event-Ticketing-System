import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import MyTicketsPage from './pages/MyTicketsPage';
import TicketViewPage from './pages/TicketViewPage';
import AdminPage from './pages/AdminPage';
import EventDetailsPage from './pages/EventDetailsPage';
import ProfilePage from './pages/ProfilePage';

function getUserRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
}

function App() {
  const token = localStorage.getItem('token');
  const role = getUserRole();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div>
      <nav style={{
        padding: '1rem 3rem',
        background: 'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link to="/" style={{ color: '#fff', fontWeight: '800', fontSize: '1.2rem', letterSpacing: '-0.5px' }}>
          EVENT<span style={{ color: '#6366f1' }}>TICKETS</span>
        </Link>

        <div style={{ display: 'flex', gap: '2rem', marginLeft: '3rem' }}>
          <Link to="/events" style={{ color: '#a3a3a3', fontSize: '0.85rem', fontWeight: '500', letterSpacing: '0.5px', textTransform: 'uppercase', transition: 'color 0.2s' }}>Events</Link>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          {token ? (
            <>
              <Link to="/my-bookings" style={{ color: '#a3a3a3', fontSize: '0.85rem', fontWeight: '500' }}>Bookings</Link>
              <Link to="/my-tickets" style={{ color: '#a3a3a3', fontSize: '0.85rem', fontWeight: '500' }}>Tickets</Link>
              <Link to="/profile" style={{ color: '#a3a3a3', fontSize: '0.85rem', fontWeight: '500' }}>Profile</Link>
              {role === 'ADMIN' && <Link to="/admin" style={{ color: '#6366f1', fontSize: '0.85rem', fontWeight: '600' }}>Admin</Link>}
              <button onClick={handleLogout} style={{
                background: 'transparent',
                border: '1px solid #333',
                color: '#a3a3a3',
                padding: '0.4rem 1rem',
                fontSize: '0.8rem',
              }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#a3a3a3', fontSize: '0.85rem', fontWeight: '500' }}>Login</Link>
              <Link to="/register">
                <button style={{ padding: '0.45rem 1.2rem', fontSize: '0.8rem' }}>Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/booking/:eventId" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/ticket/:id" element={<TicketViewPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
