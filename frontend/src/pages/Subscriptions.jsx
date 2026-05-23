import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { Loader, AlertTriangle, UserMinus, DollarSign, Calendar, ShieldCheck } from 'lucide-react';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const data = await api.getSubscriptions();
      setSubscriptions(data || []);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleSuspend = async (type, vendorId, vendorName) => {
    if (!window.confirm(`Are you sure you want to suspend ${vendorName}? This will immediately disable their public profile and block logins until payment is resolved.`)) {
      return;
    }

    try {
      await api.suspendVendor(type, vendorId);
      // Update local state status
      setSubscriptions(subscriptions.map(sub => {
        if (sub.vendorId === vendorId) {
          return { ...sub, status: 'suspended' };
        }
        return sub;
      }));
      alert(`${vendorName}'s profile has been suspended.`);
    } catch (err) {
      alert(`Suspension failed: ${err.message}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const isExpired = (endDateString) => {
    if (!endDateString) return false;
    return new Date(endDateString) < new Date();
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="title-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>
          Vendor Subscriptions
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Monitor merchant membership packages, track billing cycles, and suspend access for delinquent accounts.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '0' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader className="animate-spin" size={32} color="var(--accent)" />
          </div>
        ) : subscriptions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            No subscriptions found in the database.
          </div>
        ) : (
          <table className="custom-table" style={{ marginTop: '0' }}>
            <thead>
              <tr>
                <th>Vendor / Owner</th>
                <th>Type</th>
                <th>Plan Details</th>
                <th>Payment Status</th>
                <th>Billing Cycle (End Date)</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map(sub => {
                const unpaid = sub.status === 'unpaid' || isExpired(sub.endDate);
                const suspended = sub.status === 'suspended';
                const active = sub.status === 'active' && !isExpired(sub.endDate);

                return (
                  <tr key={sub._id}>
                    <td>
                      <div>
                        <strong style={{ fontSize: '1rem', display: 'block' }}>{sub.vendorName}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Owner: {sub.owner?.name || 'Owner User'} ({sub.owner?.email || 'N/A'})
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{
                        backgroundColor: sub.vendorType === 'salon' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(236, 72, 153, 0.05)',
                        color: sub.vendorType === 'salon' ? 'var(--accent)' : 'hsl(325, 85%, 65%)',
                        border: '1px solid ' + (sub.vendorType === 'salon' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(236, 72, 153, 0.2)')
                      }}>
                        {sub.vendorType}
                      </span>
                    </td>
                    <td>
                      <div>
                        <span style={{ fontWeight: 600 }}>{sub.planName} Plan</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>
                          ${sub.price?.toFixed(2)} / month
                        </span>
                      </div>
                    </td>
                    <td>
                      {suspended ? (
                        <span className="badge suspended">Suspended</span>
                      ) : unpaid ? (
                        <span className="badge unpaid" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <AlertTriangle size={12} />
                          <span>Unpaid (Overdue)</span>
                        </span>
                      ) : (
                        <span className="badge active">Active (Paid)</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        <span style={{ color: unpaid ? 'var(--error)' : 'var(--text-secondary)' }}>
                          {formatDate(sub.endDate)}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {suspended ? (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>
                          No Actions Required
                        </span>
                      ) : unpaid ? (
                        <button
                          onClick={() => handleSuspend(sub.vendorType, sub.vendorId, sub.vendorName)}
                          className="btn btn-danger btn-sm"
                          style={{
                            padding: '0.4rem 0.8rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.8rem',
                            width: '100%'
                          }}
                        >
                          <UserMinus size={14} />
                          <span>Suspend Profile</span>
                        </button>
                      ) : (
                        <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <ShieldCheck size={14} />
                          <span>Fully Compliant</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
