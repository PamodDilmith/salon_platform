import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const CustomerRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState({
    firstName: '', secondName: '', email: '', phone: '', nic: '', password: '', confirmPassword: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear field-level error on change
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  // --- Client-side validations ---
  const validateForm = () => {
    const errors = {};

    if (!form.firstName.trim()) errors.firstName = 'First name is required';
    if (!form.secondName.trim()) errors.secondName = 'Second name is required';
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Enter a valid email';

    // Sri Lankan phone: 0771234567, +94771234567, 94771234567
    if (!form.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^(?:0|94|\+94)?(?:7\d|1\d|2\d|3\d|4\d|5\d|6\d|8\d|9\d)\d{7}$/.test(form.phone)) {
      errors.phone = 'Enter a valid Sri Lankan phone number (e.g. 0771234567)';
    }

    // Sri Lankan NIC: old (9 digits + V/X) or new (12 digits)
    if (!form.nic.trim()) errors.nic = 'NIC is required';
    else if (!/^([0-9]{9}[xXvV]|[0-9]{12})$/.test(form.nic)) {
      errors.nic = 'Enter a valid NIC (e.g. 199912345678 or 912345678V)';
    }

    // Password: min 8 chars, must contain at least one letter and one number
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(form.password)) {
      errors.password = 'Password must contain both letters and numbers';
    }

    if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);

    try {
      await api.customerRegister(form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputGroupStyle = { position: 'relative' };
  const toggleBtnStyle = {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    cursor: 'pointer', color: 'var(--text-muted)', background: 'none', border: 'none', padding: 0,
    display: 'flex', alignItems: 'center',
  };
  const errorTextStyle = { color: 'var(--error)', fontSize: '0.78rem', marginTop: '0.3rem' };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100vw',
      background: 'radial-gradient(circle at top right, rgba(139,92,246,0.1), transparent), radial-gradient(circle at bottom left, rgba(139,92,246,0.05), transparent), var(--bg-primary)',
      padding: '2rem',
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '2.5rem', border: '1px solid var(--border-accent)' }}>

        {/* Back link */}
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem',
          transition: 'color var(--transition-fast)',
        }}>
          <ArrowLeft size={15} /> Back to Home
        </Link>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%)',
            width: '50px', height: '50px', borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)', margin: '0 auto 0.75rem',
          }}>
            <UserPlus size={26} color="white" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Create Your Account
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Join AuraGlow and book your next salon experience
          </p>
        </div>

        {/* Global Error */}
        {error && (
          <div style={{
            background: 'var(--error-glow)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
            color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center', fontWeight: 500,
          }}>
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className="form-input" name="firstName" value={form.firstName} onChange={handleChange}
                placeholder="Kasun" disabled={loading} style={fieldErrors.firstName ? { borderColor: 'var(--error)' } : {}} />
              {fieldErrors.firstName && <p style={errorTextStyle}>{fieldErrors.firstName}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Second Name</label>
              <input className="form-input" name="secondName" value={form.secondName} onChange={handleChange}
                placeholder="Perera" disabled={loading} style={fieldErrors.secondName ? { borderColor: 'var(--error)' } : {}} />
              {fieldErrors.secondName && <p style={errorTextStyle}>{fieldErrors.secondName}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="kasun@example.com" disabled={loading} style={fieldErrors.email ? { borderColor: 'var(--error)' } : {}} />
            {fieldErrors.email && <p style={errorTextStyle}>{fieldErrors.email}</p>}
          </div>

          {/* Phone & NIC Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" name="phone" value={form.phone} onChange={handleChange}
                placeholder="0771234567" disabled={loading} style={fieldErrors.phone ? { borderColor: 'var(--error)' } : {}} />
              {fieldErrors.phone && <p style={errorTextStyle}>{fieldErrors.phone}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">NIC Number</label>
              <input className="form-input" name="nic" value={form.nic} onChange={handleChange}
                placeholder="199912345678" disabled={loading} style={fieldErrors.nic ? { borderColor: 'var(--error)' } : {}} />
              {fieldErrors.nic && <p style={errorTextStyle}>{fieldErrors.nic}</p>}
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={inputGroupStyle}>
              <input className="form-input" type={showPassword ? 'text' : 'password'} name="password"
                value={form.password} onChange={handleChange} placeholder="Min 8 chars, letters & numbers"
                disabled={loading} style={fieldErrors.password ? { borderColor: 'var(--error)', paddingRight: '2.5rem' } : { paddingRight: '2.5rem' }} />
              <button type="button" style={toggleBtnStyle} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password && <p style={errorTextStyle}>{fieldErrors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Confirm Password</label>
            <div style={inputGroupStyle}>
              <input className="form-input" type={showConfirm ? 'text' : 'password'} name="confirmPassword"
                value={form.confirmPassword} onChange={handleChange} placeholder="Re-enter your password"
                disabled={loading} style={fieldErrors.confirmPassword ? { borderColor: 'var(--error)', paddingRight: '2.5rem' } : { paddingRight: '2.5rem' }} />
              <button type="button" style={toggleBtnStyle} onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && <p style={errorTextStyle}>{fieldErrors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login redirect */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
