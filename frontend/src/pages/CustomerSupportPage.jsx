import React, { useState, useEffect, useContext } from 'react';
import { api } from '../api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Image as ImageIcon, FileText, Trash2, Edit3, MessageCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerSupportPage = () => {
  const { customerLogout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Views: 'list', 'create', 'view', 'edit'
  const [view, setView] = useState('list');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Form states
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await api.getCustomerTickets();
      setTickets(data);
    } catch (err) {
      if (err.response?.status === 401) {
        customerLogout();
        navigate('/login');
      }
      setError(err.response?.data?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim() || !description.trim()) {
      setError('Topic and description are required.');
      return;
    }

    const formData = new FormData();
    formData.append('topic', topic);
    formData.append('description', description);
    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      setLoading(true);
      if (view === 'edit' && selectedTicket) {
        await api.updateCustomerTicket(selectedTicket._id, formData);
      } else {
        await api.createCustomerTicket(formData);
      }
      await fetchTickets();
      resetForm();
      setView('list');
    } catch (err) {
      if (err.response?.status === 401) {
        customerLogout();
        navigate('/login');
      }
      setError(err.response?.data?.message || 'Failed to save ticket');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        setLoading(true);
        await api.deleteCustomerTicket(id);
        await fetchTickets();
        if (selectedTicket && selectedTicket._id === id) {
          setView('list');
        }
      } catch (err) {
        if (err.response?.status === 401) {
          customerLogout();
          navigate('/login');
        }
        setError(err.response?.data?.message || 'Failed to delete ticket');
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setTopic('');
    setDescription('');
    setAttachment(null);
    setError('');
    setSelectedTicket(null);
  };

  const handleEditClick = (ticket) => {
    setSelectedTicket(ticket);
    setTopic(ticket.topic);
    setDescription(ticket.description);
    setAttachment(null);
    setView('edit');
  };

  const handleViewClick = (ticket) => {
    setSelectedTicket(ticket);
    setView('view');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ 
              background: 'var(--bg-surface)', border: '1px solid var(--border-color)', 
              color: 'var(--text-secondary)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)' }}>
            <MessageCircle size={28} color="var(--accent)" />
            Support Tickets
          </h1>
        </div>

        {/* Content Area */}
        <div className="glass-card" style={{ padding: '2rem', minHeight: '500px' }}>
          {error && <div style={{ color: 'var(--error)', padding: '1rem', background: 'var(--error-glow)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}

          {loading && view === 'list' && <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><div className="spinner"></div></div>}

          {view === 'list' && !loading && (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  onClick={() => { resetForm(); setView('create'); }}
                >
                  <Plus size={16} /> Create New Ticket
                </button>
              </div>

              {tickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  <MessageCircle size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <p style={{ fontSize: '1.1rem' }}>No tickets found.</p>
                  <p style={{ fontSize: '0.9rem' }}>Create one to get help from our support team!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {tickets.map(t => (
                    <div 
                      key={t._id} 
                      className="glass-card interactive" 
                      style={{ padding: '1.5rem', cursor: 'pointer', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }} 
                      onClick={() => handleViewClick(t)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{t.topic}</span>
                        <span style={{ 
                          fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontWeight: 600,
                          background: t.status === 'Resolved' ? 'var(--success-glow)' : 'var(--accent-glow)',
                          color: t.status === 'Resolved' ? 'var(--success)' : 'var(--accent)',
                        }}>
                          {t.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {t.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <span>Created on {new Date(t.createdAt).toLocaleDateString()}</span>
                        {t.replies?.length > 0 && <span>{t.replies.length} repl{t.replies.length === 1 ? 'y' : 'ies'}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {(view === 'create' || view === 'edit') && (
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                {view === 'create' ? 'Create New Ticket' : 'Edit Ticket'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Topic</label>
                  <input type="text" className="form-input" style={{ padding: '0.75rem' }} value={topic} onChange={e => setTopic(e.target.value)} disabled={loading} required />
                </div>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows="6" style={{ padding: '0.75rem' }} value={description} onChange={e => setDescription(e.target.value)} disabled={loading} required></textarea>
                </div>
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label">Attachment (Optional, max 5MB, Image/PDF)</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                    <input type="file" onChange={e => setAttachment(e.target.files[0])} disabled={loading} accept=".jpg,.jpeg,.png,.pdf" />
                  </div>
                  {view === 'edit' && selectedTicket?.attachment && !attachment && (
                     <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Current attachment will be kept unless you upload a new one.</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }} onClick={() => setView('list')} disabled={loading}>Cancel</button>
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }} disabled={loading}>{loading ? 'Saving...' : (view === 'create' ? 'Submit Ticket' : 'Save Changes')}</button>
                </div>
              </form>
            </div>
          )}

          {view === 'view' && selectedTicket && (
            <div>
              <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ArrowLeft size={16} /> Back to List
              </button>
              
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{selectedTicket.topic}</h3>
                  <span style={{ 
                    fontSize: '0.85rem', padding: '0.25rem 1rem', borderRadius: '2rem', fontWeight: 600,
                    background: selectedTicket.status === 'Resolved' ? 'var(--success-glow)' : 'var(--accent-glow)',
                    color: selectedTicket.status === 'Resolved' ? 'var(--success)' : 'var(--accent)',
                  }}>
                    {selectedTicket.status}
                  </span>
                </div>
                
                <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: '2rem' }}>{selectedTicket.description}</p>
                
                {selectedTicket.attachment && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', display: 'inline-block' }}>
                    <a href={`http://localhost:5050${selectedTicket.attachment}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
                      {selectedTicket.attachment.endsWith('.pdf') ? <FileText size={20} /> : <ImageIcon size={20} />}
                      View Attached File
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                {selectedTicket.status === 'Pending' && (
                  <button className="btn btn-secondary" style={{ padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => handleEditClick(selectedTicket)}>
                    <Edit3 size={16} /> Edit Ticket
                  </button>
                )}
                <button className="btn" style={{ padding: '0.75rem 2rem', background: 'var(--error-glow)', color: 'var(--error)', border: '1px solid var(--error)', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => handleDelete(selectedTicket._id)}>
                  <Trash2 size={16} /> Delete Ticket
                </button>
              </div>

              {/* Replies History */}
              <div>
                <h4 style={{ fontSize: '1.2rem', margin: '0 0 1.5rem 0', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>Communication History</h4>
                {(!selectedTicket.replies || selectedTicket.replies.length === 0) ? (
                  <div style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)' }}>
                    <MessageCircle size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                    <p style={{ margin: 0 }}>No replies yet. Our support team will get back to you soon.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {selectedTicket.replies.map((r, i) => (
                      <div key={i} style={{
                        background: r.senderRole === 'admin' ? 'rgba(34, 197, 94, 0.05)' : 'var(--bg-primary)',
                        border: r.senderRole === 'admin' ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid var(--border-color)',
                        padding: '1.5rem', borderRadius: 'var(--radius-md)',
                        marginLeft: r.senderRole === 'admin' ? '0' : '2rem',
                        marginRight: r.senderRole === 'admin' ? '2rem' : '0'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: r.senderRole === 'admin' ? 'var(--success)' : 'var(--accent)' }}>
                            {r.senderRole === 'admin' ? 'Support Team' : 'You'}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleString()}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportPage;
