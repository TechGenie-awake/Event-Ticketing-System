import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';

function App() {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div>
      <nav style={{ padding: '1rem 2rem', background: '#1e1b4b', color: 'white', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>EventTickets</Link>
        <Link to="/events" style={{ color: '#c7d2fe' }}>Events</Link>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
          {token ? (
            <>
              <Link to="/my-bookings" style={{ color: '#c7d2fe' }}>My Bookings</Link>
              <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #c7d2fe', color: '#c7d2fe', padding: '0.3rem 0.8rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#c7d2fe' }}>Login</Link>
              <Link to="/register" style={{ color: '#c7d2fe' }}>Register</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/booking/:eventId" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />
      </Routes>
    </div>
  );
}

export default App;
