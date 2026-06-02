import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';

const CustomerLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerLogin } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user was just redirected from registration
  const justRegistered = location.state?.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await customerLogin(email, password);
      if (data && data.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100vw',
      background: 'radial-gradient(circle at top right, rgba(139,92,246,0.1), transparent), radial-gradient(circle at bottom left, rgba(139,92,246,0.05), transparent), var(--bg-primary)',
      padding: '1.5rem',
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', border: '1px solid var(--border-accent)' }}>

        {/* Back link */}
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem',
          transition: 'color var(--transition-fast)',
        }}>
          <ArrowLeft size={15} /> Back to Home
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%)',
            width: '54px', height: '54px', borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)', marginBottom: '1rem',
          }}>
            <LogIn size={28} color="white" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Sign in to your AuraGlow account
          </p>
        </div>

        {/* Success banner from registration */}
        {justRegistered && (
          <div style={{
            background: 'var(--success-glow)', border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
            color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1.25rem',
            textAlign: 'center', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          }}>
            <CheckCircle size={16} /> Registration successful! Please sign in.
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            background: 'var(--error-glow)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
            color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center', fontWeight: 500,
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com" required disabled={loading} />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} className="form-input"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" required disabled={loading} style={{ paddingRight: '2.5rem' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  cursor: 'pointer', color: 'var(--text-muted)', background: 'none', border: 'none',
                  padding: 0, display: 'flex', alignItems: 'center',
                }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px' }} disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Register link */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent)', fontWeight: 600 }}>Register</Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
