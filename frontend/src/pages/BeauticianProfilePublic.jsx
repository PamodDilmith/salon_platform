import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { MapPin, Star, Award, Clock, ArrowLeft, ShieldCheck } from 'lucide-react';

const BeauticianProfilePublic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [beautician, setBeautician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  
  const [loggedInUser, setLoggedInUser] = React.useState(() => {
    return JSON.parse(localStorage.getItem('customerInfo')) || JSON.parse(localStorage.getItem('beauticianInfo'));
  });
  const isCustomer = loggedInUser && loggedInUser.role === 'customer';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.getBeauticianProfilePublic(id);
        setBeautician(data);
        const reviewsData = await api.getBeauticianReviews(id);
        setReviews(reviewsData);
      } catch (err) {
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) return;
    setSubmittingReview(true);
    setReviewError('');
    try {
      await api.submitBeauticianReview(id, reviewForm.rating, reviewForm.comment);
      const reviewsData = await api.getBeauticianReviews(id);
      setReviews(reviewsData);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      setReviewError(err.response?.data?.message || err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ color: 'var(--accent)', fontSize: '2rem' }}>⟳</div>
      </div>
    );
  }

  if (error || !beautician) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--error)' }}>{error || 'Beautician not found'}</h2>
        <button onClick={() => navigate('/beauticians')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      
      {/* Hero Section */}
      <div style={{ height: '250px', background: 'linear-gradient(135deg, rgba(139,92,246,0.2) 0%, rgba(11,11,15,1) 100%)', position: 'relative' }}>
        <button onClick={() => navigate('/beauticians')} style={{ 
          position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', 
          background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', cursor: 'pointer', backdropFilter: 'blur(4px)'
        }}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '-100px auto 2rem', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Header Info */}
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ 
              width: '160px', height: '160px', borderRadius: '50%', border: '4px solid var(--bg-surface)', 
              background: 'var(--bg-primary)', overflow: 'hidden', boxShadow: 'var(--shadow-glow)'
            }}>
              {beautician.profilePhotoUrl ? (
                <img src={`http://localhost:5050${beautician.profilePhotoUrl}`} alt={beautician.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent)', color: 'white', fontSize: '4rem', fontWeight: 800 }}>
                  {beautician.name.charAt(0)}
                </div>
              )}
            </div>
            <div style={{ flex: 1, paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.5rem' }}>
                    {beautician.name}
                  </h1>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)' }}><Award size={16} /> {beautician.roleTitle || 'Beautician'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16} /> {beautician.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Clock size={16} /> {beautician.experienceYears} Years Exp.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-color)' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            {/* Left Col */}
            <div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem', color: 'var(--text-primary)' }}>About</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
                {beautician.description || 'No description provided.'}
              </p>

              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem', color: 'var(--text-primary)' }}>Specializations</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {beautician.specialties?.map(spec => (
                  <div key={spec} style={{ 
                    padding: '0.5rem 1rem', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)',
                    color: 'var(--accent)', borderRadius: 'var(--radius-full)', fontSize: '0.9rem', fontWeight: 500 
                  }}>
                    {spec}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col */}
            <div>
              <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '1rem' }}>
                  <ShieldCheck size={20} /> <span style={{ fontWeight: 600 }}>Verified Professional</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Rating</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-primary)' }}><Star size={16} fill="var(--accent)" color="var(--accent)"/> {beautician.rating || '0.0'} ({beautician.reviewCount || 0} reviews)</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Status</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>Available</span>
                </div>
              </div>
              
              <button className="btn btn-secondary" style={{ width: '100%', height: '45px' }}>Book Appointment</button>
            </div>
          </div>

        </div>

        {/* Reviews Section */}
        <div className="glass-card" style={{ padding: '2.5rem', marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Reviews & Ratings</h3>
          
          {/* Write a Review */}
          {isCustomer && (
            <div style={{ background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Write a Review</h4>
              {reviewError && <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem' }}>{reviewError}</div>}
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Rating:</span>
                  <select 
                    value={reviewForm.rating} 
                    onChange={e => setReviewForm({...reviewForm, rating: e.target.value})}
                    style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
                <textarea 
                  className="form-input" 
                  rows="3" 
                  placeholder="Share your experience..." 
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}

          {/* List Reviews */}
          {reviews.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No reviews yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {reviews.map(review => (
                <div key={review._id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 600 }}>{review.userName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--accent)', gap: '0.2rem', fontSize: '0.9rem' }}>
                      <Star size={14} fill="var(--accent)" /> {review.rating}/5
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{review.comment}</p>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BeauticianProfilePublic;
