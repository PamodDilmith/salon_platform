import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  Users,
  Scissors,
  Sparkles,
  CreditCard,
  MessageSquare,
  Star,
  Loader,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getStats();
        setStats(data);
      } catch (err) {
        setError('Failed to fetch dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <Loader className="animate-spin" size={36} color="var(--accent)" />
        <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>Loading Dashboard Overview...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card" style={{ border: '1px solid var(--error)', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--error)' }}>{error}</p>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const { metrics, pendingRequests } = stats;

  const cardData = [
    { title: 'Total Customers', value: metrics.totalUsers, icon: Users, color: 'hsl(217, 91%, 60%)' },
    { title: 'Registered Salons', value: metrics.totalSalons, icon: Scissors, color: 'var(--accent)' },
    { title: 'Beauticians', value: metrics.totalBeauticians, icon: Sparkles, color: 'hsl(320, 89%, 60%)' },
    { title: 'Active Premium', value: metrics.activeSubscriptions, icon: CreditCard, color: 'var(--success)' },
    { title: 'Open Tickets', value: metrics.openTickets, icon: MessageSquare, color: 'var(--warning)' },
    { title: 'Reviews Moderated', value: metrics.totalReviews, icon: Star, color: 'hsl(45, 95%, 55%)' },
  ];

  return (
    <div>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }} className="title-gradient">
            Overview Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            System-wide statistics, vendor audits, and customer support desks.
          </p>
        </div>

        {pendingRequests > 0 && (
          <Link to="/registrations" style={{ display: 'block' }}>
            <div style={{
              background: 'var(--warning-glow)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--warning)',
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}>
              <span>{pendingRequests} Pending Registration{pendingRequests > 1 ? 's' : ''}</span>
              <ArrowUpRight size={14} />
            </div>
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid-stats">
        {cardData.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-card interactive" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                background: `rgba(${parseInt(card.color.substring(4)) ? '255,255,255' : '139, 92, 246'}, 0.05)`,
                border: `1px solid ${card.color}25`,
                borderRadius: 'var(--radius-md)',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color
              }}>
                <Icon size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block' }}>
                  {card.title}
                </span>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: '1.2' }}>
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sub sections (Audit Panel Quick Links) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        
        {/* Salon Audit Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Scissors size={18} color="var(--accent)" />
            <span>Salon Audits</span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Authorize incoming vendor shop requests. Inspect and verify registration credentials, certificates, locations, and salon profile logs.
          </p>
          <Link to="/registrations" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Manage Registrations
          </Link>
        </div>

        {/* Support Card */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={18} color="var(--success)" />
            <span>Support Desk</span>
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            Handle customer support tickets. View and respond to query logs submitted by customers, shop managers, or beauticians.
          </p>
          <Link to="/support" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
            Open Support Desk
          </Link>
        </div>

      </div>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DashboardOverview;
