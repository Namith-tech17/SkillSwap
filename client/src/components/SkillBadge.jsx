import React from 'react';
import { X, BookOpen, Award } from 'lucide-react';

/**
 * SkillBadge Component
 * Demonstrates: Props (Sl. No. 5) & Event Handling (Sl. No. 8)
 */
const SkillBadge = ({
  name,
  category,
  level,
  priority,
  type = 'teach',
  onRemove = null,
  interactive = false,
  onClick = null
}) => {
  const isTeach = type === 'teach';

  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 10px',
        borderRadius: '8px',
        fontSize: '0.82rem',
        fontWeight: 600,
        backgroundColor: isTeach ? 'var(--teal-light)' : 'var(--mustard-light)',
        color: isTeach ? 'var(--teal)' : 'var(--mustard-deep)',
        border: `1px solid ${isTeach ? 'rgba(15, 118, 110, 0.25)' : 'rgba(202, 138, 4, 0.3)'}`,
        cursor: interactive ? 'pointer' : 'default',
        transition: 'transform 0.15s ease'
      }}
    >
      {isTeach ? <Award size={13} /> : <BookOpen size={13} />}
      <span>{name}</span>
      {level && (
        <span
          style={{
            fontSize: '0.68rem',
            background: 'rgba(0,0,0,0.06)',
            padding: '1px 5px',
            borderRadius: '4px'
          }}
        >
          {level}
        </span>
      )}
      {priority && (
        <span
          style={{
            fontSize: '0.68rem',
            background: 'rgba(0,0,0,0.06)',
            padding: '1px 5px',
            borderRadius: '4px'
          }}
        >
          {priority} Priority
        </span>
      )}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(name);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
          title="Remove Skill"
        >
          <X size={13} />
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
