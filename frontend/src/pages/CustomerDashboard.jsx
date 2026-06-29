import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, CalendarDays, Star, Clock, ChevronDown, X, Trash2, LifeBuoy, Scissors } from 'lucide-react';
import { api } from '../api';

const CustomerDashboard = () => {
  const { customer, customerLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Profile edit states
  const [firstName, setFirstName] = useState(customer?.firstName || '');
  const [secondName, setSecondName] = useState(customer?.secondName || '');
  const [phone, setPhone] = useState(customer?.phone || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    customerLogout();
    navigate('/');
  };

  const quickActions = [
    { icon: <CalendarDays size={24} />, label: 'Book Appointment', desc: 'Find a salon and book your next visit' },
    { icon: <Scissors size={24} />, label: 'Contact Your Beautician', desc: 'Find and chat with approved beauticians', onClick: () => navigate('/beauticians') },
    { icon: <Clock size={24} />, label: 'My Bookings', desc: 'View your upcoming and past appointments' },
    { icon: <Star size={24} />, label: 'My Reviews', desc: 'Manage your reviews and ratings' },
    { icon: <User size={24} />, label: 'My Profile', desc: 'Update your personal information', onClick: () => { setIsProfileModalOpen(true); setIsDropdownOpen(false); } },
  ];

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.updateCustomerProfile({ firstName, secondName, phone });
      setSuccess('Profile updated successfully!');
      
      const storedInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}');
      const newInfo = { ...storedInfo, firstName, secondName, phone };
      localStorage.setItem('customerInfo', JSON.stringify(newInfo));
      
      setIsEditMode(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      setLoading(true);
      try {
        await api.deleteCustomerProfile();
        handleLogout();
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to delete profile');
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* Top Navigation */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem 2.5rem', borderBottom: '1px solid var(--border-color)',
        backdropFilter: 'blur(12px)', background: 'rgba(11,11,15,0.7)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem' }}>
          Aura<span style={{ color: 'var(--accent)' }}>Glow</span>
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative' }}>
          
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              background: 'var(--bg-surface)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)', cursor: 'pointer', userSelect: 'none'
            }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 700, color: 'white',
            }}>
              {customer?.firstName?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
              Welcome, {customer?.firstName}
            </span>
            <ChevronDown size={16} color="var(--text-secondary)" />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div style={{
              position: 'absolute', top: '120%', right: 0, width: '200px',
              background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-glow)',
              overflow: 'hidden', zIndex: 60
            }}>
              <div 
                onClick={() => { setIsProfileModalOpen(true); setIsDropdownOpen(false); }}
                style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <User size={16} /> View Profile
              </div>
              <div 
                onClick={handleLogout}
                style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--error)' }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(239,68,68,0.1)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
              >
                <LogOut size={16} /> Logout
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>

        {/* Quick Actions */}
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem',
        }}>
          {quickActions.map((action, i) => (
            <div key={i} onClick={action.onClick} className="glass-card interactive" style={{
              padding: '1.75rem', cursor: 'pointer', textAlign: 'center',
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: 'var(--radius-md)',
                background: 'var(--accent-glow)', border: '1px solid var(--border-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1rem', color: 'var(--accent)',
              }}>
                {action.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: '0.4rem' }}>{action.label}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>{action.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '420px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => { setIsProfileModalOpen(false); setIsEditMode(false); }}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
              {isEditMode ? 'Edit Profile' : 'My Profile'}
            </h2>
            
            {error && <div style={{ color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1rem', background: 'var(--error-glow)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
            {success && <div style={{ color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1rem', background: 'var(--success-glow)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>{success}</div>}
            
            {!isEditMode ? (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>First Name</span>
                      <div style={{ fontWeight: 500 }}>{customer?.firstName}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Last Name</span>
                      <div style={{ fontWeight: 500 }}>{customer?.secondName}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Email (Non-editable)</span>
                      <div style={{ fontWeight: 500 }}>{customer?.email}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Phone Number</span>
                      <div style={{ fontWeight: 500 }}>{customer?.phone}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>NIC (Non-editable)</span>
                      <div style={{ fontWeight: 500 }}>{customer?.nic}</div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditMode(true)}
                  className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required disabled={loading} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-input" value={secondName} onChange={(e) => setSecondName(e.target.value)} required disabled={loading} />
                </div>
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={loading} />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <button type="button" onClick={() => setIsEditMode(false)} className="btn btn-secondary" style={{ flex: 1 }} disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />
            
            <button 
              onClick={handleDeleteProfile} 
              disabled={loading}
              style={{ 
                width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', 
                border: '1px solid var(--error)', color: 'var(--error)', background: 'transparent', 
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' 
              }}
            >
              <Trash2 size={16} /> Delete Profile
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        onClick={() => navigate('/dashboard/support')}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 90,
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'var(--accent)', color: 'white', border: 'none',
          boxShadow: 'var(--shadow-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'transform var(--transition-fast)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <LifeBuoy size={30} />
      </button>

    </div>
  );
};

export default CustomerDashboard;
