import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Users,
  Calendar,
  MessageSquare,
  BookOpen,
  User,
  Info,
  ShieldCheck,
  LogIn,
  LogOut,
  PlayCircle
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, allUsers, switchUser, setAuthModalOpen, logout, authToken } = useAuth();

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                backgroundColor: 'var(--navy)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold'
              }}
            >
              <Sparkles size={20} color="#14b8a6" />
            </div>
            <div>
              <span style={{ fontSize: '1.28rem', fontWeight: 700, color: 'var(--navy)', fontFamily: 'Space Grotesk' }}>
                SkillSwap
              </span>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.68rem',
                  color: 'var(--teal)',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  lineHeight: 1
                }}
              >
                RV UNIVERSITY • CS3301
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav>
            <ul className="nav-links">
              <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} end>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/explore" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  <Users size={16} /> Match Engine
                </NavLink>
              </li>
              <li>
                <NavLink to="/booking" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  <Calendar size={16} /> Live Calendar
                </NavLink>
              </li>
              <li>
                <NavLink to="/chat" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  <MessageSquare size={16} /> Peer Chat
                </NavLink>
              </li>
              <li>
                <NavLink to="/sessions" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  <BookOpen size={16} /> Sessions
                </NavLink>
              </li>
              <li>
                <NavLink to="/demo" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')} style={{ color: 'var(--teal)' }}>
                  <ShieldCheck size={16} /> Demo & Verification
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                  <Info size={16} /> Architecture
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* User Section & Auth Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <NavLink
                  to="/profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    padding: '4px 10px',
                    background: 'var(--paper-subtle)',
                    border: '1px solid var(--border)',
                    borderRadius: '24px'
                  }}
                  title="View / Edit Profile"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ textAlign: 'left', display: 'none', md: 'block' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--navy)', lineHeight: 1.1 }}>
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.66rem', color: 'var(--teal)', fontWeight: 600 }}>
                      JWT Active
                    </div>
                  </div>
                </NavLink>

                {/* Switcher */}
                <select
                  value={currentUser.user_id}
                  onChange={(e) => switchUser(e.target.value)}
                  style={{
                    padding: '5px 8px',
                    fontSize: '0.76rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    background: '#ffffff',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: 'var(--navy)'
                  }}
                  title="Switch Active Peer"
                >
                  {allUsers.map((u) => (
                    <option key={u.user_id} value={u.user_id}>
                      Switch: {u.name.split(' ')[0]}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  title="Login or Register"
                >
                  <LogIn size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="btn btn-primary btn-sm"
              >
                <LogIn size={14} /> Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
