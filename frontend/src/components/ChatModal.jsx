import React, { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../api';
import { X, Send, User } from 'lucide-react';

const ChatModal = ({ receiverId, receiverName, onClose, currentUserId, token }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const intervalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = useCallback(async () => {
    if (!receiverId || !token) return;
    try {
      const data = await api.getChatHistory(receiverId, token);
      setMessages(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setLoading(false);
    }
  }, [receiverId, token]);

  // Start polling when component mounts or receiverId changes
  useEffect(() => {
    setLoading(true);
    setMessages([]);
    fetchMessages();

    // Clear old interval and start fresh
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchMessages, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      await api.sendMessage(receiverId, content, token);
      // Immediately fetch to show the sent message
      await fetchMessages();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', right: '2rem', width: '380px', height: '550px',
      background: '#0B0B13', border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1000,
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem', background: '#131320', color: 'white', flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #6366f1, #a855f7)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
          }}>
            <User size={20} color="white" />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {receiverName}
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Active now</span>
          </div>
        </div>
        <button onClick={onClose} style={{ 
          background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', 
          cursor: 'pointer', padding: '0.4rem', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s'
        }}>
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '1.25rem',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        background: '#0B0B13'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', margin: 'auto' }}>
            Start the conversation with {receiverName}!
          </div>
        ) : (
          messages.map((msg, index) => {
            // Robust check: If the sender is NOT the receiver, it MUST be you.
            // This bypasses any corrupted currentUserId states or test account overlaps.
            const senderStr = String(msg.sender?._id || msg.sender);
            const isMe = senderStr !== String(receiverId);

            return (
              <div key={msg._id || index} style={{
                alignSelf: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  background: isMe ? '#5B58F5' : '#1A1A24',
                  color: 'white',
                  padding: '0.8rem 1.1rem',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  fontSize: '0.9rem',
                  lineHeight: '1.4',
                  boxShadow: isMe ? '0 4px 15px rgba(91, 88, 245, 0.2)' : '0 2px 5px rgba(0,0,0,0.1)',
                  wordBreak: 'break-word'
                }}>
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ 
        padding: '1rem', background: '#0B0B13', flexShrink: 0,
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <form onSubmit={handleSend} style={{ 
          display: 'flex', gap: '0.5rem', background: '#1A1A24', 
          padding: '0.4rem', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            style={{
              flex: 1, padding: '0.65rem 1rem', borderRadius: '30px',
              border: 'none', background: 'transparent',
              color: 'white', fontSize: '0.9rem', outline: 'none'
            }}
          />
          <button type="submit" disabled={!newMessage.trim() || sending} style={{
            width: '42px', height: '42px', borderRadius: '50%', background: '#5B58F5',
            color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: (newMessage.trim() && !sending) ? 'pointer' : 'default',
            opacity: (newMessage.trim() && !sending) ? 1 : 0.5, flexShrink: 0,
            transition: 'opacity 0.2s, transform 0.1s',
            transform: (newMessage.trim() && !sending) ? 'scale(1)' : 'scale(0.95)'
          }}>
            <Send size={18} style={{ marginLeft: '-2px' }} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
