import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { X, Lock, Mail, User, ShieldCheck, KeyRound, AlertCircle, Sparkles } from 'lucide-react';

const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, login, register, switchUser, allUsers } = useAuth();
  const { addNotification } = useNotification();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [emailOrUsn, setEmailOrUsn] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [usn, setUsn] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(emailOrUsn, password);
      addNotification('Authenticated!', `Welcome back, ${user.name}. JWT token generated.`, 'success');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await register({
        name,
        email,
        usn,
        department,
        password: regPassword
      });
      addNotification('Account Created', `Welcome to SkillSwap, ${user.name}! JWT token issued.`, 'success');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoSign = async (user) => {
    await switchUser(user.user_id);
    addNotification('Demo Login Active', `Authenticated as ${user.name} with JWT.`, 'info');
    setAuthModalOpen(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(20, 24, 36, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '480px',
          width: '100%',
          background: '#ffffff',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <button
          onClick={() => setAuthModalOpen(false)}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              background: 'var(--teal-light)',
              color: 'var(--teal)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 10px'
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ fontSize: '1.4rem', margin: 0, color: 'var(--navy)' }}>
            {mode === 'login' ? 'Student Sign In' : 'Create Student Account'}
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Secured by <strong>bcrypt</strong> password hashing & <strong>JWT (HMAC-SHA256)</strong> tokens
          </p>
        </div>

        {/* 1-Click Fast Examiner Demo Login */}
        <div
          style={{
            background: 'var(--paper-subtle)',
            border: '1px dashed var(--teal)',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '20px'
          }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--teal)" /> 1-Click Examiner Demo Sign-In:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {allUsers.slice(0, 4).map((u) => (
              <button
                key={u.user_id}
                type="button"
                onClick={() => handleQuickDemoSign(u)}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--navy)'
                }}
              >
                <img src={u.avatar} alt={u.name} style={{ width: '16px', height: '16px', borderRadius: '50%' }} />
                <span>{u.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab switch between Login and Register */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: mode === 'login' ? '2px solid var(--teal)' : '2px solid transparent',
              color: mode === 'login' ? 'var(--navy)' : 'var(--text-muted)'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              borderBottom: mode === 'register' ? '2px solid var(--teal)' : '2px solid transparent',
              color: mode === 'register' ? 'var(--navy)' : 'var(--text-muted)'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #f87171',
              color: '#b91c1c',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">College Email or USN:</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="e.g. hemanth@rvu.edu.in or 1RUA24SCS0041"
                  value={emailOrUsn}
                  onChange={(e) => setEmailOrUsn(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password:</label>
              <div style={{ position: 'relative' }}>
                <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  placeholder="Enter password (default: password123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '36px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px', padding: '12px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In with JWT'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name:</label>
              <input
                type="text"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">University Seat Number (USN):</label>
              <input
                type="text"
                placeholder="e.g. 1RUA24SCS0099"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">College Email Address:</label>
              <input
                type="email"
                placeholder="name@rvu.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Department:</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password (min 6 characters):</label>
              <input
                type="password"
                placeholder="Choose a secure password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="form-input"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '10px', padding: '12px' }}
            >
              {loading ? 'Creating Account...' : 'Register & Generate JWT'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
