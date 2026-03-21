import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Create Account</h2>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {[
          { name: 'name', type: 'text', placeholder: 'Full Name', required: true },
          { name: 'email', type: 'email', placeholder: 'Email', required: true },
          { name: 'phone', type: 'tel', placeholder: 'Phone (optional)', required: false },
          { name: 'password', type: 'password', placeholder: 'Password', required: true },
        ].map((field) => (
          <div key={field.name} style={{ marginBottom: '1rem' }}>
            <input
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={form[field.name]}
              onChange={handleChange}
              required={field.required}
            />
          </div>
        ))}
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center', color: '#666' }}>
        Already have an account? <Link to="/login" style={{ color: '#4f46e5' }}>Login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
