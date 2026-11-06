import React from 'react';
import { Star, MessageSquare, Calendar, Sparkles, ArrowRight } from 'lucide-react';
import SkillBadge from './SkillBadge';
import { useNavigate } from 'react-router-dom';

/**
 * PeerCard Component
 * Demonstrates: Parent-Child Components (Sl. 4), Props (Sl. 5), Event Handling (Sl. 8)
 */
const PeerCard = ({ peer, matchType, compatibility, onSelectForBooking, onStartChat }) => {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        {/* Header with avatar, compatibility and rating */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={peer.avatar}
              alt={peer.name}
              style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
            />
            <div>
              <h4 style={{ fontSize: '1.05rem', margin: 0, color: 'var(--navy)' }}>{peer.name}</h4>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {peer.department} • {peer.semester}
              </span>
            </div>
          </div>

          {compatibility && (
            <span
              className={`badge ${compatibility >= 90 ? 'badge-teal' : 'badge-mustard'}`}
              style={{ fontSize: '0.78rem' }}
            >
              <Sparkles size={12} /> {compatibility}% Match
            </span>
          )}
        </div>

        {/* Bio */}
        <p style={{ fontSize: '0.86rem', color: 'var(--text)', marginBottom: '16px', lineHeight: 1.5 }}>
          {peer.bio}
        </p>

        {/* Match Type Banner if present */}
        {matchType && (
          <div
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              backgroundColor: 'var(--paper-deep)',
              fontSize: '0.76rem',
              fontWeight: 600,
              color: 'var(--navy)',
              marginBottom: '14px'
            }}
          >
            Type: {matchType}
          </div>
        )}

        {/* Skills Offered (Teaches) */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--teal)', letterSpacing: '0.04em', marginBottom: '6px' }}>
            Can Teach:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {(peer.skills_teach || []).map((st) => (
              <SkillBadge
                key={st.skill_id || st.skill_name}
                name={st.skill_name}
                level={st.proficiency_level}
                type="teach"
              />
            ))}
          </div>
        </div>

        {/* Skills Desired (Wants to Learn) */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--mustard-deep)', letterSpacing: '0.04em', marginBottom: '6px' }}>
            Wants to Learn:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {(peer.skills_learn || []).map((sl) => (
              <SkillBadge
                key={sl.skill_id || sl.skill_name}
                name={sl.skill_name}
                priority={sl.priority}
                type="learn"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div
        style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
          <Star size={15} fill="#eab308" color="#ca8a04" />
          <span>{peer.rating_avg || '5.0'}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({peer.total_reviews || 0} reviews)</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onStartChat ? onStartChat(peer) : navigate('/chat')}
            className="btn btn-secondary btn-sm"
            title="Chat before booking"
          >
            <MessageSquare size={14} /> Chat
          </button>
          <button
            onClick={() => onSelectForBooking ? onSelectForBooking(peer) : navigate('/booking')}
            className="btn btn-primary btn-sm"
          >
            <Calendar size={14} /> Book Slot
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeerCard;
