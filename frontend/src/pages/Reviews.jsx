import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Trash2, Star, Loader, AlertCircle } from 'lucide-react';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const data = await api.getReviews();
      setReviews(data || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently remove this review? This action cannot be undone.')) {
      return;
    }

    try {
      await api.deleteReview(id);
      setReviews(reviews.filter(r => r._id !== id));
      alert('Review deleted.');
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          fill={i <= rating ? 'var(--warning)' : 'none'}
          color={i <= rating ? 'var(--warning)' : 'var(--text-muted)'}
          style={{ marginRight: '0.1rem' }}
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>
          User Reviews Moderation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Inspect rating reviews published on merchant listings and delete inappropriate, offensive, or spam comments.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Loader className="animate-spin" size={32} color="var(--accent)" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
          <AlertCircle size={32} color="var(--text-muted)" style={{ marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
          No user reviews found in the database.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reviews.map(review => (
            <div key={review._id} className="glass-card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex' }}>
                    {renderStars(review.rating)}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Posted on {formatDate(review.createdAt)}
                  </span>
                </div>

                <p style={{ fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '1rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                  "{review.comment}"
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div>
                    <strong style={{ color: 'var(--text-secondary)' }}>By:</strong> {review.userName}
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text-secondary)' }}>Reviewing:</strong> {review.vendorName}{' '}
                    <span style={{
                      fontSize: '0.75rem',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      padding: '0.1rem 0.3rem',
                      borderRadius: 'var(--radius-sm)',
                      textTransform: 'capitalize'
                    }}>
                      {review.vendorType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action column */}
              <div>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="btn btn-secondary"
                  style={{
                    color: 'var(--error)',
                    borderColor: 'rgba(239, 68, 68, 0.2)',
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(239, 68, 68, 0.02)'
                  }}
                  title="Remove Review"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
