import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{
        width: '100%', maxWidth: '400px', padding: '2.5rem',
        background: '#141414', borderRadius: '16px', border: '1px solid #1f1f1f',
      }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Welcome back</h2>
        <p style={{ color: '#525252', fontSize: '0.85rem', marginBottom: '2rem' }}>Sign in to your account</p>

        {error && (
          <div style={{ background: '#1c1017', border: '1px solid #3b1323', color: '#ef4444', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', color: '#737373', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.4rem' }}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
          </div>
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', color: '#737373', fontSize: '0.8rem', fontWeight: '500', marginBottom: '0.4rem' }}>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.7rem', fontSize: '0.9rem', fontWeight: '600' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#525252', fontSize: '0.85rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#6366f1', fontWeight: '500' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
