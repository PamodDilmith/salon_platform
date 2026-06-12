import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { LifeBuoy, CheckCircle, Clock, Trash2, MessageSquare, FileText, Image as ImageIcon } from 'lucide-react';

const CustomerSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Pending');
  
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await api.getAllCustomerTickets();
      setTickets(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    try {
      setReplying(true);
      await api.replyToCustomerTicket(selectedTicket._id, replyMessage);
      setReplyMessage('');
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reply to ticket');
    } finally {
      setReplying(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      try {
        setLoading(true);
        await api.deleteAdminCustomerTicket(id);
        fetchTickets();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete ticket');
        setLoading(false);
      }
    }
  };

  const pendingTickets = tickets.filter(t => t.status === 'Pending');
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved');

  const displayedTickets = activeTab === 'Pending' ? pendingTickets : resolvedTickets;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LifeBuoy size={28} color="var(--accent)" />
          Customer Support Tickets
        </h1>
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Review and respond to customer inquiries and issues.</p>
      </div>

      {error && <div style={{ color: 'var(--error)', padding: '1rem', background: 'var(--error-glow)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>{error}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => { setActiveTab('Pending'); setSelectedTicket(null); }}
          style={{
            background: 'none', border: 'none', padding: '0.75rem 1.5rem', cursor: 'pointer',
            fontSize: '1rem', fontWeight: 600, color: activeTab === 'Pending' ? 'var(--accent)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'Pending' ? '2px solid var(--accent)' : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <Clock size={16} /> Pending ({pendingTickets.length})
        </button>
        <button 
          onClick={() => { setActiveTab('Resolved'); setSelectedTicket(null); }}
          style={{
            background: 'none', border: 'none', padding: '0.75rem 1.5rem', cursor: 'pointer',
            fontSize: '1rem', fontWeight: 600, color: activeTab === 'Resolved' ? 'var(--success)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'Resolved' ? '2px solid var(--success)' : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}
        >
          <CheckCircle size={16} /> Resolved ({resolvedTickets.length})
        </button>
      </div>

      {loading && !replying ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner"></div></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          {/* Ticket List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {displayedTickets.length === 0 ? (
              <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No {activeTab.toLowerCase()} tickets found.
              </div>
            ) : (
              displayedTickets.map(t => (
                <div 
                  key={t._id} 
                  className={`glass-card ${selectedTicket?._id === t._id ? 'interactive' : ''}`}
                  style={{ 
                    padding: '1.25rem', cursor: 'pointer', 
                    border: selectedTicket?._id === t._id ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                    background: selectedTicket?._id === t._id ? 'var(--bg-surface)' : 'rgba(255,255,255,0.02)'
                  }}
                  onClick={() => setSelectedTicket(t)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.topic}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {t.description}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>From: {t.customer?.firstName} {t.customer?.secondName}</span>
                    {t.attachment && <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FileText size={12}/> Attachment</span>}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Ticket Detail / Action Panel */}
          <div>
            {selectedTicket ? (
              <div className="glass-card" style={{ padding: '1.5rem', position: 'sticky', top: '100px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{selectedTicket.topic}</h3>
                  <span style={{ 
                    fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '1rem',
                    background: selectedTicket.status === 'Resolved' ? 'var(--success-glow)' : 'var(--accent-glow)',
                    color: selectedTicket.status === 'Resolved' ? 'var(--success)' : 'var(--accent)',
                  }}>
                    {selectedTicket.status}
                  </span>
                </div>
                
                <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>{selectedTicket.customer?.firstName} {selectedTicket.customer?.secondName} ({selectedTicket.customer?.email})</span>
                    <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                    {selectedTicket.description}
                  </p>
                  
                  {selectedTicket.attachment && (
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                      <a href={`http://localhost:5050${selectedTicket.attachment}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent)', textDecoration: 'none' }}>
                        {selectedTicket.attachment.endsWith('.pdf') ? <FileText size={16} /> : <ImageIcon size={16} />}
                        View Attached File
                      </a>
                    </div>
                  )}
                </div>

                {/* Replies History */}
                {selectedTicket.replies && selectedTicket.replies.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', margin: '0 0 1rem 0', color: 'var(--text-secondary)' }}>Resolution</h4>
                    {selectedTicket.replies.map((r, idx) => (
                      <div key={idx} style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--success)' }}>
                          <span style={{ fontWeight: 600 }}>Admin Response</span>
                          <span>{new Date(r.createdAt).toLocaleString()}</span>
                        </div>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{r.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form (Only if pending) */}
                {activeTab === 'Pending' ? (
                  <form onSubmit={handleReplySubmit}>
                    <div className="form-group">
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MessageSquare size={14} /> Send Reply & Resolve Ticket
                      </label>
                      <textarea 
                        className="form-input" 
                        rows="4" 
                        placeholder="Type your response here..."
                        value={replyMessage}
                        onChange={e => setReplyMessage(e.target.value)}
                        disabled={replying}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={replying || !replyMessage.trim()}>
                      {replying ? 'Submitting...' : 'Submit Reply & Mark Resolved'}
                    </button>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                      You must reply to the customer to resolve or dismiss the ticket.
                    </p>
                  </form>
                ) : (
                  <button 
                    onClick={() => handleDelete(selectedTicket._id)}
                    className="btn" 
                    style={{ width: '100%', padding: '0.75rem', background: 'var(--error-glow)', color: 'var(--error)', border: '1px solid var(--error)' }}
                  >
                    <Trash2 size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                    Delete Ticket
                  </button>
                )}
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <LifeBuoy size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>No Ticket Selected</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Select a ticket from the list to view details and respond.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSupportTickets;
