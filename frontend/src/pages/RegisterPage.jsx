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

  const fields = [
    { name: 'name', type: 'text', label: 'Full Name', placeholder: 'John Doe', required: true },
    { name: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com', required: true },
    { name: 'phone', type: 'tel', label: 'Phone (optional)', placeholder: '+91 9876543210', required: false },
    { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••', required: true },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{
        width: '100%', maxWidth: '400px', padding: '2.5rem',
        background: '#141414', borderRadius: '16px', border: '1px solid #1f1f1f',
      }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Create account</h2>
        <p style={{ color: '#525252', fontSize: '0.85rem', marginBottom: '2rem' }}>Get started with EventTickets</p>

        {error && (
          <div style={{ background: '#1c1017', border: '1px solid #3b1323', color: '#ef4444', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#737373', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.4rem' }}>{field.label}</label>
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
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.7rem', fontSize: '0.9rem', fontWeight: '600', marginTop: '0.75rem' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#525252', fontSize: '0.85rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#6366f1', fontWeight: '500' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
