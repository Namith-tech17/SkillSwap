import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  MessageSquare,
  Award,
  AlertCircle,
  X,
  Send,
  ThumbsUp
} from 'lucide-react';
import RatingStars from '../components/RatingStars';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const SessionsPage = () => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotification();

  const [sessions, setSessions] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'confirmed', 'completed'
  const [loading, setLoading] = useState(true);

  // Review & Rating Modal Form State (Sl. 9: Form Handling)
  const [selectedSessionForReview, setSelectedSessionForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Fetch sessions and reviews
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [sessData, fbData] = await Promise.all([api.getSessions(), api.getFeedback()]);
        setSessions(sessData);
        setFeedbackList(fbData);
      } catch (err) {
        console.error('Failed to load sessions data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle Mark Session Complete
  const handleMarkComplete = async (sessionId) => {
    try {
      const res = await api.completeSession(sessionId);
      setSessions((prev) =>
        prev.map((s) => (s.session_id === sessionId ? { ...s, status: 'completed' } : s))
      );
      addNotification('Session Completed', 'Session marked as finished. Leave a quick peer review!', 'success');
      // Prompt review modal
      const sess = sessions.find((s) => s.session_id === sessionId);
      if (sess) {
        setSelectedSessionForReview(sess);
      }
    } catch (err) {
      alert('Failed to complete session: ' + err.message);
    }
  };

  // Submit Feedback Form (Sl. 8 & 9)
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      setReviewError('Please write a brief comment describing the swap experience.');
      return;
    }

    setReviewError('');
    setSubmittingReview(true);

    try {
      const res = await api.submitFeedback({
        session_id: selectedSessionForReview.session_id,
        teacher_id: selectedSessionForReview.teacher_id,
        rating: reviewRating,
        comment: reviewComment.trim(),
        skill_name: selectedSessionForReview.skill_name,
      });

      setFeedbackList([res.feedback, ...feedbackList]);
      addNotification('Feedback Submitted', `Thanks for rating ${selectedSessionForReview.teacher_name}!`, 'success');
      setSelectedSessionForReview(null);
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Filtered session list
  const filteredSessions = sessions.filter((s) => {
    if (filterTab === 'confirmed') return s.status === 'confirmed';
    if (filterTab === 'completed') return s.status === 'completed';
    return true;
  });

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-teal">
            <Award size={14} /> Accountability & Verification
          </span>
          <span className="badge badge-mustard">
            <Star size={14} /> Peer Feedback System
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Sessions & Peer Feedback
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '750px' }}>
          Keep track of your confirmed peer skill swaps, mark sessions as completed, and leave verified ratings to build a trusted campus mentorship ecosystem.
        </p>
      </div>

      {/* Tabs */}
      <div className="tab-list">
        <button
          onClick={() => setFilterTab('all')}
          className={`tab-btn ${filterTab === 'all' ? 'active' : ''}`}
        >
          All Sessions ({sessions.length})
        </button>
        <button
          onClick={() => setFilterTab('confirmed')}
          className={`tab-btn ${filterTab === 'confirmed' ? 'active' : ''}`}
        >
          Upcoming / Confirmed ({sessions.filter((s) => s.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setFilterTab('completed')}
          className={`tab-btn ${filterTab === 'completed' ? 'active' : ''}`}
        >
          Completed ({sessions.filter((s) => s.status === 'completed').length})
        </button>
      </div>

      {/* Sessions Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
        {filteredSessions.length === 0 ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No sessions match this filter.
          </div>
        ) : (
          filteredSessions.map((s) => {
            const isConfirmed = s.status === 'confirmed';
            const isCompleted = s.status === 'completed';

            return (
              <div
                key={s.session_id}
                className="card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '20px',
                  borderLeft: isConfirmed ? '4px solid var(--teal)' : '4px solid #10b981'
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span
                      className={`badge ${isConfirmed ? 'badge-teal' : 'badge-navy'}`}
                      style={{ fontSize: '0.74rem' }}
                    >
                      {isConfirmed ? '● Confirmed Slot' : '✔ Completed'}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {s.scheduled_time}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', margin: '4px 0', color: 'var(--navy)' }}>
                    {s.skill_name}
                  </h3>

                  <div style={{ fontSize: '0.88rem', color: 'var(--text)', marginBottom: '6px' }}>
                    Mentor: <strong>{s.teacher_name}</strong> ↔ Learner: <strong>{s.learner_name}</strong>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    📍 Venue: {s.meeting_mode}
                  </div>

                  {s.notes && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                      Goal: "{s.notes}"
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {isConfirmed && (
                    <button
                      onClick={() => handleMarkComplete(s.session_id)}
                      className="btn btn-teal btn-sm"
                      title="Mark session as held and finished"
                    >
                      <CheckCircle2 size={15} /> Mark Complete
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedSessionForReview(s)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Star size={14} color="#eab308" /> Rate Peer
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recent Campus Feedback / Testimonials Showcase */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>
              Verified Campus Feedback & Ratings
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Authentic reviews left by students after verified skill exchange sessions.
            </p>
          </div>
        </div>

        <div className="grid-3">
          {feedbackList.map((fb) => (
            <div key={fb.feedback_id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <RatingStars value={fb.rating} readonly size={16} />
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Verified Swap</span>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text)', fontStyle: 'italic', marginBottom: '14px', lineHeight: 1.5 }}>
                  "{fb.comment}"
                </p>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--navy)' }}>
                  By {fb.given_by_name}
                </span>
                <span className="badge badge-teal" style={{ fontSize: '0.7rem' }}>
                  {fb.skill_name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal Form (Demonstrates Form Handling Sl. 9) */}
      {selectedSessionForReview && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(20, 24, 36, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div className="card" style={{ maxWidth: '520px', width: '100%', background: '#ffffff', position: 'relative' }}>
            <button
              onClick={() => setSelectedSessionForReview(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '6px' }}>
              Leave Peer Feedback
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Rate your swap experience for <strong>{selectedSessionForReview.skill_name}</strong> with{' '}
              <strong>{selectedSessionForReview.teacher_name}</strong>.
            </p>

            <form onSubmit={handleSubmitFeedback}>
              {reviewError && (
                <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '14px' }}>
                  {reviewError}
                </div>
              )}

              {/* Star Rating Input (Sl. 4, 5, 8 Parent-Child interaction) */}
              <div className="form-group">
                <label className="form-label">Rating (1 to 5 Stars):</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
                  <RatingStars value={reviewRating} onChange={(val) => setReviewRating(val)} size={26} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--navy)' }}>
                    {reviewRating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Review Comment */}
              <div className="form-group">
                <label className="form-label">Your Review & Comments:</label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How was the session? Did your peer explain concepts clearly? Would you recommend swapping skills with them?"
                  className="form-textarea"
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedSessionForReview(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn btn-teal btn-sm"
                >
                  <Send size={14} /> {submittingReview ? 'Submitting...' : 'Submit Peer Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsPage;
