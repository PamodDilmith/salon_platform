import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { UserPlus, ArrowLeft, Eye, EyeOff, UploadCloud } from 'lucide-react';

const specializationsList = [
  'Hair Styling', 'Hair Coloring', 'Makeup', 'Facial Treatments', 
  'Nail Art', 'Bridal Dressing', 'Massage Therapy'
];

const BeauticianRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const [form, setForm] = useState({
    name: '', email: '', password: '', phoneNumber: '', location: '', 
    nic: '', roleTitle: '', experienceYears: '', description: ''
  });
  const [specialties, setSpecialties] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSpecialtyChange = (spec) => {
    if (specialties.includes(spec)) {
      setSpecialties(specialties.filter(s => s !== spec));
    } else {
      setSpecialties([...specialties, spec]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      formData.append('specialties', specialties.join(','));
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }

      // We need to use axios directly or update api method to handle FormData correctly.
      // Wait, axios handles FormData if we pass it. The api method expects beauticianData.
      await api.beauticianRegister(formData);
      navigate('/login', { state: { registered: true, message: 'Beautician registered successfully. Please wait for admin approval.' } });
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

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100vw',
      background: 'radial-gradient(circle at top right, rgba(139,92,246,0.1), transparent), var(--bg-primary)',
      padding: '2rem',
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '800px', padding: '2.5rem', border: '1px solid var(--border-accent)' }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem',
        }}>
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent) 0%, #a78bfa 100%)',
            width: '60px', height: '60px', borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)', margin: '0 auto 0.75rem',
          }}>
            <UserPlus size={30} color="white" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            Beautician Registration
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Join our platform. Enjoy a 1-week free trial before your subscription begins.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--error-glow)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem',
            color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1.25rem', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
          
          {/* Profile Photo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%', border: '2px dashed var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              backgroundColor: 'rgba(139,92,246,0.05)', position: 'relative'
            }}>
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <UploadCloud size={30} color="var(--accent)" />
              )}
            </div>
            <label className="btn btn-secondary" style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              Upload Profile Photo
              <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" name="name" value={form.name} onChange={handleChange} required disabled={loading} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" name="email" value={form.email} onChange={handleChange} required disabled={loading} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input className="form-input" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required disabled={loading} />
            </div>
            <div className="form-group">
              <label className="form-label">Location (City)</label>
              <input className="form-input" name="location" value={form.location} onChange={handleChange} required disabled={loading} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">National Identity Card (NIC)</label>
              <input 
                className="form-input" 
                name="nic" 
                value={form.nic} 
                onChange={handleChange} 
                required 
                disabled={loading} 
                pattern="^([0-9]{9}[vVxX]|[0-9]{12})$" 
                title="Please enter a valid Sri Lankan NIC (e.g., 123456789V or 199012345678)"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Position / Role</label>
              <input className="form-input" name="roleTitle" placeholder="e.g., Senior Hair Stylist" value={form.roleTitle} onChange={handleChange} required disabled={loading} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Years of Experience</label>
              <input className="form-input" type="number" name="experienceYears" value={form.experienceYears} onChange={handleChange} required disabled={loading} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={inputGroupStyle}>
                <input className="form-input" type={showPassword ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange} required disabled={loading} style={{ paddingRight: '2.5rem' }} />
                <button type="button" style={toggleBtnStyle} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Brief Description</label>
            <textarea className="form-input" name="description" value={form.description} onChange={handleChange} rows="3" disabled={loading}></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Specializations</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
              {specializationsList.map(spec => (
                <label key={spec} style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: specialties.includes(spec) ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                  color: specialties.includes(spec) ? 'white' : 'var(--text-primary)',
                  padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', cursor: 'pointer',
                  border: `1px solid ${specialties.includes(spec) ? 'var(--accent)' : 'var(--border-color)'}`,
                  fontSize: '0.85rem', transition: 'all 0.2s ease'
                }}>
                  <input type="checkbox" checked={specialties.includes(spec)} onChange={() => handleSpecialtyChange(spec)} style={{ display: 'none' }} />
                  {spec}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '50px', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Submitting Registration...' : 'Register for 1-Week Free Trial'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default BeauticianRegister;
