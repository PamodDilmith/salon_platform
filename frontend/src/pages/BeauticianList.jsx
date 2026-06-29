import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Search, MapPin, Star, Award, Loader2, ArrowLeft } from 'lucide-react';

const BeauticianList = () => {
  const navigate = useNavigate();
  const [beauticians, setBeauticians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialties = ['All', 'Hair Styling', 'Hair Coloring', 'Makeup', 'Facial Treatments', 'Nail Art', 'Bridal Dressing', 'Massage Therapy'];

  useEffect(() => {
    const fetchBeauticians = async () => {
      try {
        const data = await api.getApprovedBeauticians();
        setBeauticians(data);
      } catch (err) {
        setError('Failed to load beauticians. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchBeauticians();
  }, []);

  const filteredBeauticians = beauticians.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (b.roleTitle && b.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === 'All' || (b.specialties && b.specialties.includes(selectedSpecialty));
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/dashboard')} className="btn" style={{ 
          display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', 
          border: 'none', color: 'var(--text-secondary)', padding: '0', marginBottom: '2rem', cursor: 'pointer' 
        }}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
              Find Your <span style={{ color: 'var(--accent)' }}>Beautician</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Browse through our curated list of professional beauticians.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '500px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search by name, role or location..." 
                className="form-input" 
                style={{ paddingLeft: '2.5rem' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="form-input" 
              style={{ width: '180px' }}
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div style={{ background: 'var(--error-glow)', color: 'var(--error)', padding: '1rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '2rem' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 size={40} className="spinner" style={{ color: 'var(--accent)' }} />
          </div>
        ) : filteredBeauticians.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {filteredBeauticians.map(beautician => (
              <div 
                key={beautician._id} 
                className="glass-card interactive" 
                style={{ padding: '1.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                onClick={() => navigate(`/beauticians/${beautician._id}`)}
              >
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ 
                    width: '80px', height: '80px', borderRadius: 'var(--radius-md)', 
                    background: 'var(--bg-surface)', overflow: 'hidden', flexShrink: 0 
                  }}>
                    {beautician.profilePhotoUrl ? (
                      <img src={`http://localhost:5050${beautician.profilePhotoUrl}`} alt={beautician.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-glow)', color: 'var(--accent)', fontSize: '2rem', fontWeight: 800 }}>
                        {beautician.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>{beautician.name}</h3>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem' }}>
                      <Award size={14} /> {beautician.roleTitle || 'Beautician'}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={14} /> {beautician.location}
                    </div>
                  </div>
                </div>
                
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '1rem' }}>
                    {beautician.description}
                  </p>
                  
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {beautician.specialties?.slice(0, 3).map(spec => (
                      <span key={spec} style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--accent)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 600 }}>
                        {spec}
                      </span>
                    ))}
                    {beautician.specialties?.length > 3 && (
                      <span style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', fontSize: '0.75rem' }}>
                        +{beautician.specialties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)' }}>
                    <Star size={16} fill="var(--accent)" />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>4.9</span>
                  </div>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>View Profile</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-color)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No beauticians found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeauticianList;
