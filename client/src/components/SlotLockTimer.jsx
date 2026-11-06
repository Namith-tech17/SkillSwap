import React, { useState, useEffect } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

/**
 * SlotLockTimer Component
 * Demonstrates: useState (Sl. 6), useEffect (Sl. 7), Event/Callback Props (Sl. 4, 5)
 * Prevents double-booking by counting down locked slot duration
 */
const SlotLockTimer = ({ initialSeconds = 60, onExpire, slotName = 'Slot' }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      if (onExpire) onExpire();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, onExpire]);

  const percentage = (secondsLeft / initialSeconds) * 100;
  const isUrgent = secondsLeft <= 15;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        borderRadius: '8px',
        background: isUrgent ? '#fef2f2' : 'var(--mustard-light)',
        border: `1px solid ${isUrgent ? '#f87171' : 'var(--mustard)'}`,
        color: isUrgent ? '#b91c1c' : 'var(--mustard-deep)',
        fontSize: '0.82rem',
        fontWeight: 600
      }}
    >
      <Lock size={14} className={isUrgent ? 'animate-bounce' : ''} />
      <span>
        {slotName} reserved: <strong>{secondsLeft}s</strong> remaining
      </span>
      {isUrgent && <AlertCircle size={14} />}
    </div>
  );
};

export default SlotLockTimer;
