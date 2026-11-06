import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, Calendar, CheckCircle, Sparkles, MessageCircle, Info } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const peerIdFromQuery = searchParams.get('peerId');

  const { currentUser, allUsers } = useAuth();
  const [activePeerId, setActivePeerId] = useState(peerIdFromQuery || 'usr_2');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  // Available chat peers (all other students)
  const chatPeers = allUsers.filter((u) => u.user_id !== currentUser?.user_id);
  const activePeer = allUsers.find((u) => u.user_id === activePeerId) || chatPeers[0];

  // Fetch messages on peer change
  useEffect(() => {
    if (!activePeerId) return;

    async function loadMessages() {
      try {
        const msgs = await api.getMessages(activePeerId);
        setMessages(msgs);
      } catch (err) {
        console.error('Failed to load chat:', err);
      }
    }
    loadMessages();

    // Simulated real-time polling every 4 seconds
    const interval = setInterval(loadMessages, 4000);
    return () => clearInterval(interval);
  }, [activePeerId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message handler
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const textToSend = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    try {
      const newMsg = await api.sendMessage({
        peer_id: activePeerId,
        sender_id: currentUser?.user_id || 'usr_1',
        sender_name: currentUser?.name || 'Hemanth B Y',
        text: textToSend,
      });

      setMessages((prev) => [...prev, newMsg]);
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setSending(false);
    }
  };

  // Quick Action proposal
  const sendQuickProposal = (prompt) => {
    setInputMessage(prompt);
  };

  return (
    <div className="container" style={{ padding: '36px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <span className="badge badge-teal" style={{ marginBottom: '8px' }}>
          <MessageCircle size={14} /> In-App Peer Coordination
        </span>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '4px' }}>
          Peer Swap Chat
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Coordinate learning goals, confirm campus venues, or discuss mutual swap topics before locking your calendar session.
        </p>
      </div>

      {/* Main Chat Window */}
      <div className="chat-window">
        {/* Left Sidebar: Peer List */}
        <div style={{ borderRight: '1px solid var(--border)', background: 'var(--paper-subtle)', overflowY: 'auto' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.92rem', color: 'var(--navy)' }}>
            Active Peers ({chatPeers.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {chatPeers.map((peer) => {
              const isSelected = peer.user_id === activePeerId;
              return (
                <div
                  key={peer.user_id}
                  onClick={() => setActivePeerId(peer.user_id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 18px',
                    cursor: 'pointer',
                    background: isSelected ? '#ffffff' : 'transparent',
                    borderLeft: isSelected ? '4px solid var(--teal)' : '4px solid transparent',
                    borderBottom: '1px solid rgba(228, 222, 203, 0.4)',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <img
                    src={peer.avatar}
                    alt={peer.name}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--navy)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {peer.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--teal)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                      Teaches: {peer.skills_teach?.map((s) => s.skill_name).join(', ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Main Chat Area */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
          {/* Active Peer Header */}
          {activePeer && (
            <div
              style={{
                padding: '14px 24px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#ffffff'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={activePeer.avatar}
                  alt={activePeer.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '1rem', margin: 0, color: 'var(--navy)' }}>{activePeer.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {activePeer.department} • Rating: {activePeer.rating_avg} ★
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => navigate(`/booking?teacherId=${activePeer.user_id}`)}
                  className="btn btn-primary btn-sm"
                  title="Book Live Calendar Slot"
                >
                  <Calendar size={14} /> Book Calendar Slot
                </button>
              </div>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--paper)' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <MessageCircle size={36} style={{ margin: '0 auto 10px', color: 'var(--border)' }} />
                No messages yet. Send a hello or propose a swap topic below!
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === currentUser?.user_id;
                const isSystem = msg.sender_id === 'system';

                if (isSystem) {
                  return (
                    <div
                      key={msg.message_id}
                      style={{
                        margin: '8px auto',
                        background: 'var(--paper-deep)',
                        border: '1px solid var(--border)',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        color: 'var(--navy)',
                        fontWeight: 600,
                        textAlign: 'center',
                        maxWidth: '80%'
                      }}
                    >
                      {msg.text}
                    </div>
                  );
                }

                return (
                  <div
                    key={msg.message_id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMe ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '3px' }}>
                      {isMe ? 'You' : msg.sender_name} • {msg.timestamp}
                    </span>
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '10px 16px',
                        borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        background: isMe ? 'var(--navy)' : '#ffffff',
                        color: isMe ? '#ffffff' : 'var(--navy)',
                        fontSize: '0.9rem',
                        lineHeight: 1.45,
                        boxShadow: 'var(--shadow-sm)',
                        border: isMe ? 'none' : '1px solid var(--border)'
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Swap Prompts Bar */}
          <div style={{ padding: '8px 20px', background: 'var(--paper-subtle)', borderTop: '1px solid var(--border)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
              Quick topics:
            </span>
            {[
              "Are you free to meet in the Student Center today?",
              "Can you help me with the basics of this skill?",
              "I have my notes and setup ready for our session!",
              "Would you prefer an online Google Meet instead?"
            ].map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => sendQuickProposal(prompt)}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '3px 10px',
                  fontSize: '0.74rem',
                  color: 'var(--navy)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box Form */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: '10px',
              background: '#ffffff'
            }}
          >
            <input
              type="text"
              placeholder={`Type a message to ${activePeer?.name}... (Press Enter to send)`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="form-input"
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || sending}
              className="btn btn-teal"
              style={{ padding: '10px 18px', borderRadius: 'var(--radius-md)' }}
            >
              <Send size={16} /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
