import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1e1b4b' }}>
        Book Tickets for Amazing Events
      </h1>
      <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
        Discover concerts, sports, theater and more. Secure your seat today.
      </p>
      <Link to="/events">
        <button style={{ padding: '0.8rem 2.5rem', fontSize: '1rem', borderRadius: '6px' }}>
          Browse Events
        </button>
      </Link>
    </div>
  );
}

export default HomePage;
