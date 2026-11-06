import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { Bell, Sparkles, CheckCircle2, AlertTriangle, X } from 'lucide-react';

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotification();

  if (!notifications.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: '100%'
      }}
    >
      {notifications.map((n) => {
        const isMatch = n.type === 'match';
        const isSuccess = n.type === 'success';

        return (
          <div
            key={n.id}
            style={{
              background: '#ffffff',
              border: `1.5px solid ${isMatch ? 'var(--teal)' : isSuccess ? '#10b981' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'slide-in 0.3s ease'
            }}
          >
            <div
              style={{
                background: isMatch ? 'var(--teal-light)' : isSuccess ? '#dcfce7' : 'var(--paper-deep)',
                color: isMatch ? 'var(--teal)' : isSuccess ? '#166534' : 'var(--navy)',
                padding: '8px',
                borderRadius: '8px',
                flexShrink: 0
              }}
            >
              {isMatch ? <Sparkles size={18} /> : isSuccess ? <CheckCircle2 size={18} /> : <Bell size={18} />}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy)', margin: 0 }}>
                  {n.title}
                </h5>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{n.time}</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                {n.message}
              </p>
            </div>

            <button
              onClick={() => removeNotification(n.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px',
                lineHeight: 1
              }}
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationToast;
