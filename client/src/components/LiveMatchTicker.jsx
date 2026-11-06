import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LiveMatchTicker = ({ matchCount = 5 }) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-full)',
        padding: '6px 14px',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '20px'
      }}
    >
      <span className="pulse-dot"></span>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>
        {matchCount} matches happening right now on campus
      </span>
      <Link
        to="/explore"
        style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--teal)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          textDecoration: 'none'
        }}
      >
        View Swaps <ArrowRight size={13} />
      </Link>
    </div>
  );
};

export default LiveMatchTicker;
