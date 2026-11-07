import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  Lock,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Video,
  Info,
  ShieldCheck
} from 'lucide-react';
import SlotLockTimer from '../components/SlotLockTimer';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const LiveCalendarPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const teacherIdFromQuery = searchParams.get('teacherId');

  const { currentUser, allUsers } = useAuth();
  const { addNotification } = useNotification();

  const [teachers, setTeachers] = useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState(teacherIdFromQuery || 'usr_2');
  const [slots, setSlots] = useState([]);
  const [activeLockedSlot, setActiveLockedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // My Availability State
  const [mySlots, setMySlots] = useState([]);
  const [availabilityForm, setAvailabilityForm] = useState({
    day: 'Monday',
    time: '10:00 AM'
  });
  const [isCreatingSlot, setIsCreatingSlot] = useState(false);

  // Functional Booking Form State (Requirement Sl. No. 9: Form Handling)
  const [formData, setFormData] = useState({
    skill_name: '',
    meeting_mode: 'In-Person (Campus Hub)',
    custom_location: 'Student Activity Center, Room 204',
    session_goals: '',
    duration: '60 minutes',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Set available teachers list (excluding current user)
  useEffect(() => {
    if (allUsers.length > 0 && currentUser) {
      const peers = allUsers.filter((u) => u.user_id !== currentUser.user_id);
      setTeachers(peers);
      if (!teacherIdFromQuery && peers.length > 0 && !selectedTeacherId) {
        setSelectedTeacherId(peers[0].user_id);
      }
    }
  }, [allUsers, currentUser, teacherIdFromQuery]);

  // Fetch slots for selected teacher
  useEffect(() => {
    if (!selectedTeacherId) return;
    setLoadingSlots(true);
    api
      .getSlots(selectedTeacherId)
      .then((data) => {
        setSlots(data);
        // Prepopulate default skill if teacher has teach skills
        const teacher = allUsers.find((u) => u.user_id === selectedTeacherId);
        if (teacher && teacher.skills_teach?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            skill_name: teacher.skills_teach[0].skill_name,
          }));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingSlots(false));
  }, [selectedTeacherId, allUsers]);

  // Fetch availability slots posted by the current user
  useEffect(() => {
    if (!currentUser?.user_id) return;

    api
      .getSlots(currentUser.user_id)
      .then((data) => setMySlots(data))
      .catch((err) => console.error('Could not load your availability:', err));
  }, [currentUser]);

  // Create a new availability slot
  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();

    if (!availabilityForm.day || !availabilityForm.time.trim()) {
      addNotification('Missing Details', 'Please select a day and enter a time.', 'error');
      return;
    }

    setIsCreatingSlot(true);

    try {
      await api.createSlot({
        day: availabilityForm.day,
        time: availabilityForm.time.trim()
      });

      const updatedSlots = await api.getSlots(currentUser.user_id);
      setMySlots(updatedSlots);

      addNotification(
        'Availability Posted!',
        `${availabilityForm.day} at ${availabilityForm.time} is now available for students to book.`,
        'success'
      );

      setAvailabilityForm({
        day: 'Monday',
        time: '10:00 AM'
      });
    } catch (err) {
      addNotification(
        'Could Not Post Availability',
        err.message || 'Something went wrong while creating your slot.',
        'error'
      );
    } finally {
      setIsCreatingSlot(false);
    }
  };

  // Handle slot locking (Implements real-time double-booking prevention)
  const handleLockSlot = async (slot) => {
    if (slot.status === 'booked') return;
    if (slot.status === 'locked' && slot.locked_by !== currentUser?.user_id) {
      alert('This slot is currently locked by another student. Please pick another slot or wait 60s.');
      return;
    }

    try {
      const res = await api.lockSlot(slot.slot_id, currentUser?.user_id || 'usr_1');
      setActiveLockedSlot(res.slot);
      setSlots((prev) =>
        prev.map((s) => (s.slot_id === slot.slot_id ? { ...s, status: 'locked', locked_by: currentUser?.user_id } : s))
      );
      addNotification('Slot Locked', `You have temporarily reserved ${slot.day} ${slot.time}. Complete booking within 60s.`, 'info');
    } catch (err) {
      alert(err.message || 'Could not lock slot');
    }
  };

  const handleUnlockSlot = async () => {
    if (!activeLockedSlot) return;
    try {
      await api.unlockSlot(activeLockedSlot.slot_id, currentUser?.user_id || 'usr_1');
      setSlots((prev) =>
        prev.map((s) => (s.slot_id === activeLockedSlot.slot_id ? { ...s, status: 'available', locked_by: null } : s))
      );
      setActiveLockedSlot(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Form Validation & Submission (Requirement Sl. No. 8 & 9)
  const validateForm = () => {
    const errors = {};
    if (!activeLockedSlot) {
      errors.slot = 'Please select and lock an available calendar slot first.';
    }
    if (!formData.skill_name.trim()) {
      errors.skill_name = 'Please specify what skill you want to learn.';
    }
    if (!formData.session_goals.trim()) {
      errors.session_goals = 'Please describe your learning agenda or goals for this session.';
    }
    return errors;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const teacher = allUsers.find((u) => u.user_id === selectedTeacherId);
      const scheduled_time = `${activeLockedSlot.day}, ${activeLockedSlot.time}`;
      const locationNote =
        formData.meeting_mode === 'Online Meet'
          ? 'Google Meet: https://meet.google.com/rvu-swap-desk'
          : formData.custom_location;

      const payload = {
        slot_id: activeLockedSlot.slot_id,
        teacher_id: selectedTeacherId,
        learner_id: currentUser?.user_id || 'usr_1',
        skill_name: formData.skill_name,
        scheduled_time,
        meeting_mode: `${formData.meeting_mode} (${locationNote})`,
        notes: formData.session_goals,
      };

      const res = await api.bookSession(payload);
      setBookingSuccess(res.session);
      setActiveLockedSlot(null);

      // Trigger global notification
      addNotification('Session Confirmed!', `Booked with ${teacher?.name} for ${scheduled_time}`, 'success');

      // Update slot state to booked
      setSlots((prev) =>
        prev.map((s) => (s.slot_id === payload.slot_id ? { ...s, status: 'booked' } : s))
      );
    } catch (err) {
      setFormErrors({ submit: err.message || 'Booking failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTeacher = allUsers.find((u) => u.user_id === selectedTeacherId);

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-teal">
            <Lock size={14} /> Live Calendar & Anti-Double-Booking Engine
          </span>
          <span className="badge badge-mustard">
            <ShieldCheck size={14} /> Self-Locking Concurrency Control
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Live Booking Calendar
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '750px' }}>
          Prevent double-booking in real-time. When you click a slot, it instantly locks for 60 seconds across all campus clients so no other student can claim it while you fill the confirmation details.
        </p>
      </div>

      {/* My Availability Section */}
      <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CalendarIcon size={21} color="var(--teal)" />
            My Availability
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Post your available days and times so other students can book a skill exchange session with you.
          </p>
        </div>

        <form
          onSubmit={handleAvailabilitySubmit}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '14px',
            flexWrap: 'wrap'
          }}
        >
          <div className="form-group" style={{ flex: '1 1 180px', marginBottom: 0 }}>
            <label className="form-label">Available Day</label>
            <select
              className="form-select"
              value={availabilityForm.day}
              onChange={(e) =>
                setAvailabilityForm((prev) => ({
                  ...prev,
                  day: e.target.value
                }))
              }
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: '1 1 180px', marginBottom: 0 }}>
            <label className="form-label">Available Time</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 10:00 AM"
              value={availabilityForm.time}
              onChange={(e) =>
                setAvailabilityForm((prev) => ({
                  ...prev,
                  time: e.target.value
                }))
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isCreatingSlot}
            style={{ padding: '12px 22px', minHeight: '44px' }}
          >
            {isCreatingSlot ? 'Posting...' : '+ Post Availability'}
          </button>
        </form>

        <div style={{ marginTop: '22px' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>
            My Posted Slots ({mySlots.length})
          </h4>

          {mySlots.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              You haven't posted any availability yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {mySlots.map((slot) => (
                <div
                  key={slot.slot_id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    background: '#ffffff'
                  }}
                >
                  <CalendarIcon size={16} color="var(--teal)" />
                  <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>
                    {slot.day}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    {slot.time}
                  </span>
                  <span className={`badge ${slot.status === 'available' ? 'badge-teal' : 'badge-gray'}`}>
                    {slot.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Peer Selector Bar */}
      <div className="card" style={{ marginBottom: '32px', padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Select Peer to View Live Availability:
            </label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {teachers.map((t) => (
                <button
                  key={t.user_id}
                  onClick={() => {
                    setSelectedTeacherId(t.user_id);
                    setActiveLockedSlot(null);
                    setBookingSuccess(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    border: '1.5px solid',
                    borderColor: selectedTeacherId === t.user_id ? 'var(--navy)' : 'var(--border)',
                    background: selectedTeacherId === t.user_id ? 'var(--navy)' : '#ffffff',
                    color: selectedTeacherId === t.user_id ? '#ffffff' : 'var(--navy)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedTeacher && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Teaches:</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--teal)' }}>
                {selectedTeacher.skills_teach?.map((s) => s.skill_name).join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Slots on Left, Booking Form on Right */}
      <div className="grid-2" style={{ alignItems: 'flex-start', gap: '32px' }}>
        {/* Left Column: Live Slots */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarIcon size={20} color="var(--teal)" /> Available Exchange Slots
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Click to reserve & lock slot
            </span>
          </div>

          {loadingSlots ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Loading live slots...
            </div>
          ) : slots.length === 0 ? (
            <div className="card" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No available slots posted by this student yet. Check back soon or message them via Chat.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {slots.map((slot) => {
                const isBooked = slot.status === 'booked';
                const isLocked = slot.status === 'locked';
                const isLockedByMe = isLocked && slot.locked_by === currentUser?.user_id;

                let statusBadge = (
                  <span className="badge badge-teal" style={{ fontSize: '0.74rem' }}>
                    ● Available
                  </span>
                );

                if (isBooked) {
                  statusBadge = (
                    <span className="badge badge-gray" style={{ fontSize: '0.74rem' }}>
                      ✖ Booked
                    </span>
                  );
                } else if (isLockedByMe) {
                  statusBadge = (
                    <span className="badge badge-mustard" style={{ fontSize: '0.74rem' }}>
                      <Lock size={12} /> Locked by You
                    </span>
                  );
                } else if (isLocked) {
                  statusBadge = (
                    <span className="badge badge-mustard" style={{ fontSize: '0.74rem' }}>
                      <Lock size={12} /> Locked by Peer
                    </span>
                  );
                }

                return (
                  <div
                    key={slot.slot_id}
                    onClick={() => !isBooked && !isLocked && handleLockSlot(slot)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px 20px',
                      background: isLockedByMe ? '#fffbeb' : isBooked ? '#f8fafc' : '#ffffff',
                      border: isLockedByMe
                        ? '2px solid var(--mustard)'
                        : isBooked
                        ? '1px dashed var(--border)'
                        : '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      cursor: isBooked || (isLocked && !isLockedByMe) ? 'not-allowed' : 'pointer',
                      opacity: isBooked ? 0.6 : 1,
                      transition: 'all 0.2s ease',
                      boxShadow: isLockedByMe ? 'var(--shadow-md)' : 'none'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--navy)' }}>
                          {slot.day}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          <Clock size={14} /> {slot.time}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Duration: 60 mins • Campus Peer Exchange
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {statusBadge}
                      {!isBooked && !isLocked && (
                        <button className="btn btn-secondary btn-sm" type="button">
                          Lock & Select
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Active Slot Lock Countdown Banner */}
          {activeLockedSlot && (
            <div style={{ marginTop: '20px' }}>
              <div
                style={{
                  background: 'var(--paper-subtle)',
                  border: '1.5px solid var(--mustard)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <SlotLockTimer
                    initialSeconds={60}
                    onExpire={() => {
                      alert('Slot lock reservation expired.');
                      setActiveLockedSlot(null);
                    }}
                    slotName={`${activeLockedSlot.day} ${activeLockedSlot.time}`}
                  />
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Complete the form on the right before the timer finishes!
                  </div>
                </div>
                <button onClick={handleUnlockSlot} className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem' }}>
                  Release Slot
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Functional Booking Form */}
        <div>
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>
                Confirm Session Details
              </h3>
              <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
                React Form Handling
              </span>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
                <h4 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                  Booking Confirmed!
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Your session for <strong>{bookingSuccess.skill_name}</strong> with{' '}
                  <strong>{bookingSuccess.teacher_name}</strong> is booked for {bookingSuccess.scheduled_time}.
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button onClick={() => navigate('/sessions')} className="btn btn-primary btn-sm">
                    View in My Sessions
                  </button>
                  <button onClick={() => navigate('/chat')} className="btn btn-secondary btn-sm">
                    Chat with Peer
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                {formErrors.slot && (
                  <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={16} /> {formErrors.slot}
                  </div>
                )}

                {formErrors.submit && (
                  <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
                    <AlertTriangle size={16} /> {formErrors.submit}
                  </div>
                )}

                {/* Selected Slot Indicator */}
                <div className="form-group">
                  <label className="form-label">
                    <span>Reserved Slot:</span>
                    {activeLockedSlot && <span style={{ color: 'var(--mustard-deep)' }}>🔒 Active Lock</span>}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={activeLockedSlot ? `${activeLockedSlot.day}, ${activeLockedSlot.time}` : 'No slot locked yet (Pick a slot on the left)'}
                    className="form-input"
                    style={{ background: 'var(--paper-deep)', fontWeight: 600, color: activeLockedSlot ? 'var(--navy)' : 'var(--text-muted)' }}
                  />
                </div>

                {/* Skill to Learn */}
                <div className="form-group">
                  <label className="form-label">Skill to Learn / Exchange:</label>
                  <input
                    type="text"
                    value={formData.skill_name}
                    onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
                    placeholder="e.g. Classical Guitar, React Hooks, Figma Wireframing"
                    className="form-input"
                  />
                  {formErrors.skill_name && <span className="form-error">{formErrors.skill_name}</span>}
                </div>

                {/* Meeting Mode */}
                <div className="form-group">
                  <label className="form-label">Meeting Format:</label>
                  <select
                    value={formData.meeting_mode}
                    onChange={(e) => setFormData({ ...formData, meeting_mode: e.target.value })}
                    className="form-select"
                  >
                    <option value="In-Person (Campus Hub)">🏫 In-Person (Campus Hub / Library Pod)</option>
                    <option value="Online Meet">💻 Online Meet (Google Meet / Zoom)</option>
                  </select>
                </div>

                {/* Location Details */}
                {formData.meeting_mode.includes('In-Person') ? (
                  <div className="form-group">
                    <label className="form-label">Campus Venue / Landmark:</label>
                    <input
                      type="text"
                      value={formData.custom_location}
                      onChange={(e) => setFormData({ ...formData, custom_location: e.target.value })}
                      placeholder="e.g. SAC Discussion Pod 2, Central Library 3rd Floor"
                      className="form-input"
                    />
                  </div>
                ) : (
                  <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', color: '#0f766e', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '16px' }}>
                    A Google Meet link will be automatically generated and shared in the peer chat upon booking.
                  </div>
                )}

                {/* Agenda / Goals */}
                <div className="form-group">
                  <label className="form-label">Learning Agenda & Questions:</label>
                  <textarea
                    rows={3}
                    value={formData.session_goals}
                    onChange={(e) => setFormData({ ...formData, session_goals: e.target.value })}
                    placeholder="What specific questions or topics do you want to cover during this 1-hour swap?"
                    className="form-textarea"
                  />
                  {formErrors.session_goals && <span className="form-error">{formErrors.session_goals}</span>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!activeLockedSlot || isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                >
                  {isSubmitting ? 'Confirming Slot...' : 'Confirm & Book Session'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveCalendarPage;