import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Edit3, MessageSquare, Star, Settings } from 'lucide-react';
import { api } from '../api';
const BeauticianDashboard = () => {
  const { beautician, customerLogout, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  useEffect(() => {
    // Wait until auth is resolved before redirecting
    if (authLoading) return;
    if (!beautician) {
      navigate('/beautician-register');
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await api.getBeauticianDashboard();
        setProfile(data);
        setEditForm(data);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [beautician, navigate]);

  const handleLogout = () => {
    customerLogout();
    navigate('/');
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.updateBeauticianDashboard({
        name: editForm.name,
        location: editForm.location,
        phoneNumber: editForm.phoneNumber,
        experienceYears: editForm.experienceYears,
        description: editForm.description,
      });
      setProfile(data);
      setIsEditMode(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>Loading...</div>;
  }

  if (profile?.status === 'pending') {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,165,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'orange' }}>
            <Settings size={40} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Profile Under Review</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your beautician application is currently being reviewed by our administration team. Once approved, you will have full access to your dashboard.
          </p>
          <button onClick={handleLogout} className="btn btn-secondary">Log Out</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2.5rem', borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(12px)', background: 'rgba(11,11,15,0.7)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem' }}>
          Aura<span style={{ color: 'var(--accent)' }}>Glow</span> <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>| Beautician Portal</span>
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 500 }}>{profile?.name}</span>
          <button onClick={handleLogout} className="btn" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--error)', padding: '0.5rem 1rem', border: 'none' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '2rem' }}>
          Dashboard Overview
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Stats Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Performance</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <Star size={32} color="var(--accent)" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{profile?.rating || '0.0'}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Overall Rating</div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="glass-card" style={{ padding: '2rem', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>My Profile</h3>
              {!isEditMode && (
                <button onClick={() => setIsEditMode(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                  <Edit3 size={16} /> Edit Profile
                </button>
              )}
            </div>

            {error && <div style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</div>}

            {isEditMode ? (
              <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input name="name" className="form-input" value={editForm.name || ''} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input name="phoneNumber" className="form-input" value={editForm.phoneNumber || ''} onChange={handleChange} required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input name="location" className="form-input" value={editForm.location || ''} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Years of Experience</label>
                    <input type="number" name="experienceYears" className="form-input" value={editForm.experienceYears || ''} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">About Me</label>
                  <textarea name="description" className="form-input" rows="4" value={editForm.description || ''} onChange={handleChange}></textarea>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditMode(false)} disabled={loading}>Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Name</span>
                  <span style={{ fontWeight: 500 }}>{profile?.name}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Email</span>
                  <span style={{ fontWeight: 500 }}>{profile?.user?.email}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Role</span>
                  <span style={{ fontWeight: 500 }}>{profile?.roleTitle}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Location</span>
                  <span style={{ fontWeight: 500 }}>{profile?.location}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Experience</span>
                  <span style={{ fontWeight: 500 }}>{profile?.experienceYears} Years</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Specialties</span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {profile?.specialties?.map(s => (
                      <span key={s} style={{ padding: '0.2rem 0.6rem', background: 'var(--accent)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>{s}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>About</span>
                  <span style={{ lineHeight: 1.6 }}>{profile?.description}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeauticianDashboard;
