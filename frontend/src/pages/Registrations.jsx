import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Check, X, FileText, ExternalLink, Loader, Sparkles, Scissors } from 'lucide-react';

const Registrations = () => {
  const [salons, setSalons] = useState([]);
  const [beauticians, setBeauticians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('salon'); // 'salon' or 'beautician'
  
  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingItem, setRejectingItem] = useState(null); // { type, id }
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchPending = async () => {
    try {
      const data = await api.getRegistrations();
      setSalons(data.salons || []);
      setBeauticians(data.beauticians || []);
    } catch (err) {
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (type, id) => {
    if (!window.confirm(`Are you sure you want to approve this ${type} registration?`)) return;

    try {
      await api.approveRegistration(type, id);
      // Remove from list
      if (type === 'salon') {
        setSalons(salons.filter(s => s._id !== id));
      } else {
        setBeauticians(beauticians.filter(b => b._id !== id));
      }
      alert('Registration approved successfully!');
    } catch (err) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  const handleRejectClick = (type, id) => {
    setRejectingItem({ type, id });
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason.');
      return;
    }

    const { type, id } = rejectingItem;

    try {
      await api.rejectRegistration(type, id, rejectionReason);
      if (type === 'salon') {
        setSalons(salons.filter(s => s._id !== id));
      } else {
        setBeauticians(beauticians.filter(b => b._id !== id));
      }
      setShowRejectModal(false);
      setRejectingItem(null);
      alert('Registration rejected.');
    } catch (err) {
      alert(`Rejection failed: ${err.message}`);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>
          Registration Requests
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Audit, approve, or reject new salon business and freelance beautician accounts.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('salon')}
          style={{
            padding: '0.5rem 1.25rem',
            fontWeight: 600,
            fontSize: '1rem',
            borderBottom: activeTab === 'salon' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'salon' ? 'white' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Scissors size={16} />
          <span>Salons ({salons.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('beautician')}
          style={{
            padding: '0.5rem 1.25rem',
            fontWeight: 600,
            fontSize: '1rem',
            borderBottom: activeTab === 'beautician' ? '2px solid var(--accent)' : '2px solid transparent',
            color: activeTab === 'beautician' ? 'white' : 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Sparkles size={16} />
          <span>Beauticians ({beauticians.length})</span>
        </button>
      </div>

      {/* Main List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
          <Loader className="animate-spin" size={32} color="var(--accent)" />
        </div>
      ) : activeTab === 'salon' ? (
        salons.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No pending salon registrations at the moment.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {salons.map(salon => (
              <div key={salon._id} className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'start' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {salon.name}
                    <span className="badge pending">Pending Audit</span>
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{salon.description}</p>
                  
                  {/* Detailed Meta */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <div><strong style={{ color: 'var(--text-secondary)' }}>Owner:</strong> {salon.owner?.name} ({salon.owner?.email})</div>
                    <div><strong style={{ color: 'var(--text-secondary)' }}>Phone:</strong> {salon.phoneNumber}</div>
                    <div><strong style={{ color: 'var(--text-secondary)' }}>Location:</strong> {salon.location}</div>
                    <div><strong style={{ color: 'var(--text-secondary)' }}>Address:</strong> {salon.address}</div>
                  </div>

                  {/* Categories */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem' }}>
                    {salon.categories?.map((cat, idx) => (
                      <span key={idx} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button onClick={() => handleApprove('salon', salon._id)} className="btn btn-success btn-sm">
                    <Check size={16} />
                    <span>Approve Request</span>
                  </button>
                  <button onClick={() => handleRejectClick('salon', salon._id)} className="btn btn-danger btn-secondary btn-sm" style={{ border: '1px solid var(--error)', color: 'var(--error)' }}>
                    <X size={16} />
                    <span>Reject Shop</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        beauticians.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No pending beautician registrations at the moment.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {beauticians.map(b => (
              <div key={b._id} className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'start' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {b.name}
                    <span className="badge pending">Pending Audit</span>
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{b.description}</p>
                  
                  {/* Detailed Meta */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <div><strong style={{ color: 'var(--text-secondary)' }}>Beautician:</strong> {b.user?.name} ({b.user?.email})</div>
                    <div><strong style={{ color: 'var(--text-secondary)' }}>Phone:</strong> {b.phoneNumber}</div>
                    <div><strong style={{ color: 'var(--text-secondary)' }}>Location:</strong> {b.location}</div>
                    <div><strong style={{ color: 'var(--text-secondary)' }}>Experience:</strong> {b.experienceYears} Years</div>
                  </div>

                  {/* Specialties */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem' }}>
                    {b.specialties?.map((spec, idx) => (
                      <span key={idx} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Certification Document link */}
                  {b.certificationUrl && (
                    <div style={{ marginTop: '1rem' }}>
                      <a href={b.certificationUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 500 }}>
                        <FileText size={16} />
                        <span>View Qualification Certificate</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button onClick={() => handleApprove('beautician', b._id)} className="btn btn-success btn-sm">
                    <Check size={16} />
                    <span>Approve Request</span>
                  </button>
                  <button onClick={() => handleRejectClick('beautician', b._id)} className="btn btn-danger btn-secondary btn-sm" style={{ border: '1px solid var(--error)', color: 'var(--error)' }}>
                    <X size={16} />
                    <span>Reject Member</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Rejection Modal Overlay */}
      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)' }}>
              <X size={20} />
              <span>Reject Registration</span>
            </h3>
            
            <form onSubmit={handleRejectSubmit}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Provide Reason for Rejection</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="E.g., Invalid business registration certificate attached, or image quality too low."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifySelf: 'end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowRejectModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger btn-sm">
                  Submit Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registrations;
