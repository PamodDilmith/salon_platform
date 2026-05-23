import React, { useState, useEffect, useContext } from 'react';
import { api } from '../api';
import { AuthContext } from '../context/AuthContext';
import { Loader, Send, Clock, User, Mail, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

const SupportTickets = () => {
  const { admin } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketDetailsLoading, setTicketDetailsLoading] = useState(false);

  // Reply state
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchTickets = async () => {
    try {
      const data = await api.getTickets();
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSelectTicket = async (id) => {
    setTicketDetailsLoading(true);
    try {
      const detailedTicket = await api.getTicketById(id);
      setSelectedTicket(detailedTicket);
      setReplyMessage('');
    } catch (err) {
      alert(`Failed to load ticket details: ${err.message}`);
    } finally {
      setTicketDetailsLoading(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    setSendingReply(true);
    try {
      // Call reply API
      const updatedTicket = await api.replyToTicket(
        selectedTicket._id,
        replyMessage,
        admin?.name
      );
      setSelectedTicket(updatedTicket);
      setReplyMessage('');

      // Update ticket entry in side list
      setTickets(tickets.map(t => t._id === selectedTicket._id ? { ...t, status: updatedTicket.status } : t));
    } catch (err) {
      alert(`Failed to send reply: ${err.message}`);
    } finally {
      setSendingReply(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedTicket) return;

    try {
      const updatedTicket = await api.updateTicketStatus(selectedTicket._id, newStatus);
      setSelectedTicket({ ...selectedTicket, status: updatedTicket.status });

      // Update in listing
      setTickets(tickets.map(t => t._id === selectedTicket._id ? { ...t, status: updatedTicket.status } : t));
      alert(`Ticket marked as ${newStatus}.`);
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const getPriorityColor = (prio) => {
    if (prio === 'high') return 'var(--error)';
    if (prio === 'medium') return 'var(--warning)';
    return 'hsl(217, 91%, 60%)';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
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
          Customer Support Desk
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
          Inspect queries and reply directly to user trouble logs.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem', height: 'calc(100vh - 200px)', alignItems: 'stretch' }}>
        
        {/* Left Column: Tickets List */}
        <div className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Active Support Tickets</h3>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <Loader className="animate-spin" size={24} color="var(--accent)" />
              </div>
            ) : tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                No support tickets found.
              </div>
            ) : (
              tickets.map(t => {
                const isActive = selectedTicket?._id === t._id;
                return (
                  <div
                    key={t._id}
                    onClick={() => handleSelectTicket(t._id)}
                    style={{
                      padding: '1.25rem',
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      backgroundColor: isActive ? 'rgba(139, 92, 246, 0.05)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: getPriorityColor(t.priority), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {t.priority} Priority
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {formatDate(t.createdAt)}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: isActive ? 'white' : 'var(--text-primary)', marginBottom: '0.25rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {t.subject}
                    </h4>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        By: {t.user?.name || 'Customer'}
                      </span>
                      <span className={`badge ${t.status}`} style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem' }}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Console */}
        <div className="glass-card" style={{ padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {ticketDetailsLoading ? (
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Loader className="animate-spin" size={32} color="var(--accent)" />
            </div>
          ) : selectedTicket ? (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
              
              {/* Header Panel */}
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>{selectedTicket.subject}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <User size={12} />
                      <span>{selectedTicket.user?.name} ({selectedTicket.user?.role})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Mail size={12} />
                      <span>{selectedTicket.user?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Status Switcher */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
                  <select
                    className="form-input"
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    style={{
                      padding: '0.35rem 1.75rem 0.35rem 0.75rem',
                      fontSize: '0.8rem',
                      width: 'auto',
                      backgroundColor: 'var(--bg-surface)'
                    }}
                  >
                    <option value="open">🟢 Open</option>
                    <option value="in_progress">⚙️ In Progress</option>
                    <option value="resolved">✅ Resolved</option>
                  </select>
                </div>
              </div>

              {/* Chat Thread */}
              <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                {/* Description starting text */}
                <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
                    Original Query description
                  </span>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{selectedTicket.description}</p>
                </div>

                {/* Discussion timeline */}
                {selectedTicket.messages?.map((msg, idx) => {
                  const isAdmin = msg.senderRole === 'admin';
                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isAdmin ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        alignSelf: isAdmin ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                        <span>{isAdmin ? 'You (Admin)' : msg.senderName || selectedTicket.user?.name}</span>
                        <span>•</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
                          <Clock size={10} />
                          <span>{formatDate(msg.timestamp)}</span>
                        </div>
                      </div>

                      <div style={{
                        padding: '0.75rem 1.25rem',
                        borderRadius: varBorderRadius(isAdmin),
                        background: isAdmin ? 'var(--accent)' : 'var(--bg-surface)',
                        color: 'white',
                        border: isAdmin ? 'none' : '1px solid var(--border-color)',
                        fontSize: '0.9rem',
                        lineHeight: '1.5'
                      }}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input form */}
              {selectedTicket.status === 'resolved' ? (
                <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                  <CheckCircle2 size={18} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>This ticket has been marked as Resolved. Reopen status to reply.</span>
                </div>
              ) : (
                <form onSubmit={handleSendReply} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', background: 'var(--bg-secondary)' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type administrative reply..."
                    disabled={sendingReply}
                    required
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }} disabled={sendingReply}>
                    <Send size={16} />
                  </button>
                </form>
              )}

            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', padding: '3rem', textAlign: 'center' }}>
              <MessageSquare size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
              <h3>Support Desk Offline</h3>
              <p style={{ maxWidth: '300px', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Select a ticket from the left panel to review message logs and issue administrative replies.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Helper for chat bubble border radius
const varBorderRadius = (isAdmin) => {
  return isAdmin
    ? 'var(--radius-md) var(--radius-sm) 0 var(--radius-md)'
    : 'var(--radius-sm) var(--radius-md) var(--radius-md) 0';
};

export default SupportTickets;
