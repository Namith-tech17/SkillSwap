import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import SkillBadge from '../components/SkillBadge';
import {
  User,
  Award,
  BookOpen,
  Plus,
  Save,
  CheckCircle,
  GraduationCap,
  Sparkles,
  Info
} from 'lucide-react';

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const { addNotification } = useNotification();

  const [skillsCatalog, setSkillsCatalog] = useState([]);

  // Profile fields state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [skillsTeach, setSkillsTeach] = useState([]);
  const [skillsLearn, setSkillsLearn] = useState([]);

  // New Skill Teach sub-form state
  const [teachSkillName, setTeachSkillName] = useState('');
  const [teachProficiency, setTeachProficiency] = useState('Intermediate');
  const [teachDesc, setTeachDesc] = useState('');

  // New Skill Learn sub-form state
  const [learnSkillName, setLearnSkillName] = useState('');
  const [learnPriority, setLearnPriority] = useState('High');
  const [learnNotes, setLearnNotes] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state with currentUser
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setBio(currentUser.bio || '');
      setDepartment(currentUser.department || 'Computer Science & Engineering');
      setSemester(currentUser.semester || '5th Sem');
      setSkillsTeach(currentUser.skills_teach || []);
      setSkillsLearn(currentUser.skills_learn || []);
    }
  }, [currentUser]);

  // Load skills catalog for quick suggestions
  useEffect(() => {
    api.getSkills().then((data) => setSkillsCatalog(data)).catch((err) => console.log(err));
  }, []);

  // Add a skill to "Teach" list
  const handleAddTeachSkill = (e) => {
    e.preventDefault();
    if (!teachSkillName.trim()) return;

    const exists = skillsTeach.some(
      (s) => s.skill_name.toLowerCase() === teachSkillName.trim().toLowerCase()
    );
    if (exists) {
      alert('This skill is already in your teaching list.');
      return;
    }

    const newTeachItem = {
      skill_id: `sk_custom_${Date.now()}`,
      skill_name: teachSkillName.trim(),
      proficiency_level: teachProficiency,
      description: teachDesc.trim() || 'Peer-taught skill',
    };

    setSkillsTeach([...skillsTeach, newTeachItem]);
    setTeachSkillName('');
    setTeachDesc('');
  };

  // Remove a skill from "Teach"
  const handleRemoveTeachSkill = (skillNameToRemove) => {
    setSkillsTeach(skillsTeach.filter((s) => s.skill_name !== skillNameToRemove));
  };

  // Add a skill to "Learn" list
  const handleAddLearnSkill = (e) => {
    e.preventDefault();
    if (!learnSkillName.trim()) return;

    const exists = skillsLearn.some(
      (s) => s.skill_name.toLowerCase() === learnSkillName.trim().toLowerCase()
    );
    if (exists) {
      alert('This skill is already in your wishlist.');
      return;
    }

    const newLearnItem = {
      skill_id: `sk_learn_${Date.now()}`,
      skill_name: learnSkillName.trim(),
      priority: learnPriority,
      notes: learnNotes.trim() || 'Desire to learn from peer mentors',
    };

    setSkillsLearn([...skillsLearn, newLearnItem]);
    setLearnSkillName('');
    setLearnNotes('');
  };

  // Remove a skill from "Learn"
  const handleRemoveLearnSkill = (skillNameToRemove) => {
    setSkillsLearn(skillsLearn.filter((s) => s.skill_name !== skillNameToRemove));
  };

  // Save full profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name,
        bio,
        department,
        semester,
        skills_teach: skillsTeach,
        skills_learn: skillsLearn,
      });

      setSaveSuccess(true);
      addNotification('Profile Saved', 'Your skills and profile have been updated successfully!', 'success');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save profile: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-teal">
            <User size={14} /> Profile & Skills Configuration
          </span>
          <span className="badge badge-mustard">
            <Sparkles size={14} /> Form Handling & State
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          My Skill Matrix & Profile
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '750px' }}>
          Update what you can teach and what you want to learn. Our matchmaking engine continuously scans these lists to connect you with compatible student partners.
        </p>
      </div>

      <form onSubmit={handleSaveProfile}>
        <div className="grid-2" style={{ alignItems: 'flex-start', gap: '32px' }}>
          {/* Left Column: Personal Information */}
          <div className="card" style={{ padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="var(--teal)" /> Student Credentials
            </h3>

            {/* Profile Avatar & Quick Stats */}
            {currentUser && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px',
                  background: 'var(--paper-subtle)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  border: '1px solid var(--border)'
                }}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--navy)' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    USN: <strong>{currentUser.usn}</strong> • {currentUser.email}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--teal)', fontWeight: 600, marginTop: '2px' }}>
                    Rating: {currentUser.rating_avg} ★ ({currentUser.total_reviews} reviews)
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Academic Department:</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Semester:</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="form-select"
              >
                <option value="1st Sem">1st Semester</option>
                <option value="2nd Sem">2nd Semester</option>
                <option value="3rd Sem">3rd Semester</option>
                <option value="4th Sem">4th Semester</option>
                <option value="5th Sem">5th Semester</option>
                <option value="6th Sem">6th Semester</option>
                <option value="7th Sem">7th Semester</option>
                <option value="8th Sem">8th Semester</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bio & Learning Philosophy:</label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your experience, passions, and what drives you to mentor or learn..."
                className="form-textarea"
              />
            </div>
          </div>

          {/* Right Column: Skills I Can Teach & Learn */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Skills I Can Teach Box */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.18rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} color="var(--teal)" /> Skills I Can Teach ({skillsTeach.length})
                </h3>
                <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>Mentor Side</span>
              </div>

              {/* Badges List with Remove */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', minHeight: '36px' }}>
                {skillsTeach.length === 0 ? (
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    No skills listed yet. Add what you can share with peers below.
                  </span>
                ) : (
                  skillsTeach.map((st) => (
                    <SkillBadge
                      key={st.skill_id || st.skill_name}
                      name={st.skill_name}
                      level={st.proficiency_level}
                      type="teach"
                      onRemove={handleRemoveTeachSkill}
                    />
                  ))
                )}
              </div>

              {/* Add Teach Skill Sub-Form */}
              <div style={{ background: 'var(--paper-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
                  + Add Skill to Teach:
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="Skill name (e.g. React.js, Python, Guitar)"
                    value={teachSkillName}
                    onChange={(e) => setTeachSkillName(e.target.value)}
                    className="form-input"
                    style={{ flex: 1.4 }}
                  />
                  <select
                    value={teachProficiency}
                    onChange={(e) => setTeachProficiency(e.target.value)}
                    className="form-select"
                    style={{ flex: 1 }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Brief description of what you'll teach..."
                    value={teachDesc}
                    onChange={(e) => setTeachDesc(e.target.value)}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTeachSkill}
                    className="btn btn-teal btn-sm"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </div>

            {/* Skills I Want to Learn Box */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.18rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={18} color="var(--mustard-deep)" /> Skills I Want to Learn ({skillsLearn.length})
                </h3>
                <span className="badge badge-mustard" style={{ fontSize: '0.72rem' }}>Learner Side</span>
              </div>

              {/* Badges List with Remove */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px', minHeight: '36px' }}>
                {skillsLearn.length === 0 ? (
                  <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    No skills in wishlist. Add skills you'd love to learn from peers below.
                  </span>
                ) : (
                  skillsLearn.map((sl) => (
                    <SkillBadge
                      key={sl.skill_id || sl.skill_name}
                      name={sl.skill_name}
                      priority={sl.priority}
                      type="learn"
                      onRemove={handleRemoveLearnSkill}
                    />
                  ))
                )}
              </div>

              {/* Add Learn Skill Sub-Form */}
              <div style={{ background: 'var(--paper-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px' }}>
                  + Add Skill to Learn:
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    placeholder="Skill you want to pick up..."
                    value={learnSkillName}
                    onChange={(e) => setLearnSkillName(e.target.value)}
                    className="form-input"
                    style={{ flex: 1.4 }}
                  />
                  <select
                    value={learnPriority}
                    onChange={(e) => setLearnPriority(e.target.value)}
                    className="form-select"
                    style={{ flex: 1 }}
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Specific goal (e.g. building a portfolio, hackathon)..."
                    value={learnNotes}
                    onChange={(e) => setLearnNotes(e.target.value)}
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddLearnSkill}
                    className="btn btn-mustard btn-sm"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div
          style={{
            marginTop: '32px',
            padding: '20px 28px',
            background: '#ffffff',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {saveSuccess && (
              <span className="badge badge-teal">
                <CheckCircle size={14} /> Profile changes saved to backend API!
              </span>
            )}
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total: {skillsTeach.length} skills to teach • {skillsLearn.length} skills to learn
            </span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary"
            style={{ padding: '12px 28px' }}
          >
            <Save size={16} /> {isSaving ? 'Saving Changes...' : 'Save Profile & Skills'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
