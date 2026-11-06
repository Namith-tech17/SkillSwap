import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Lock,
  MessageSquare,
  CheckCircle,
  Users,
  Compass,
  Star,
  Award,
  Zap
} from 'lucide-react';
import LiveMatchTicker from '../components/LiveMatchTicker';
import ClassActivityFeed from '../components/ClassActivityFeed';
import { api } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    studentsRegistered: 212,
    skillsExchanged: 64,
    ratingAvg: 4.8,
    responseTimeAvg: '< 2 min',
  });

  const [skills, setSkills] = useState([]);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  useEffect(() => {
    // Fetch live statistics from Express backend
    api.getStats().then((data) => setStats(data)).catch((err) => console.log(err));
    api.getSkills().then((data) => setSkills(data)).catch((err) => console.log(err));
  }, []);

  const handleQuickJoin = (e) => {
    e.preventDefault();
    if (!nameInput || !emailInput) return;
    setRegisteredSuccess(true);
    setTimeout(() => {
      navigate('/profile');
    }, 1200);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Hero Content */}
            <div>
              <LiveMatchTicker matchCount={stats.activeMatchesNow || 5} />

              <h1 className="hero-title">
                Trade what you <br />
                know for what <br />
                you want to <br />
                <span style={{ color: 'var(--teal)' }}>learn.</span>
              </h1>

              <p className="hero-subtitle">
                List a skill you can teach, find someone teaching what you want to learn, and book a session — matched and confirmed in real time, no group chats required.
              </p>

              {/* Hero CTA buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '28px' }}>
                <Link to="/explore" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                  List your first skill <ArrowRight size={16} />
                </Link>
                <Link to="/about" className="btn btn-secondary" style={{ padding: '12px 24px' }}>
                  See how matching works
                </Link>
              </div>

              {/* Trust proof avatar stack from slide 11 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex' }}>
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                    alt="Student"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white' }}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                    alt="Student"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white', marginLeft: '-8px' }}
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80"
                    alt="Student"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white', marginLeft: '-8px' }}
                  />
                </div>
                <span style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  <strong>{stats.studentsRegistered} students</strong> already listing skills this semester
                </span>
              </div>
            </div>

            {/* Right Ticket Mockup from Slide 11/13 */}
            <div>
              <div className="ticket-card">
                <div className="ticket-header">
                  <span className="badge badge-mustard" style={{ fontSize: '0.74rem' }}>
                    ● Photography open
                  </span>
                  <span className="badge badge-teal" style={{ fontSize: '0.74rem' }}>
                    <span className="pulse-dot"></span> Matched Live
                  </span>
                </div>

                <div className="ticket-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--teal)', fontWeight: 700 }}>
                        Teaches
                      </span>
                      <h4 style={{ fontSize: '1.1rem', margin: '2px 0 0', color: 'var(--navy)' }}>Priya Nair</h4>
                    </div>
                    <span className="badge badge-gray" style={{ fontSize: '0.72rem' }}>5th Sem Design</span>
                  </div>

                  <div style={{ background: 'var(--paper-subtle)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                    Skill offered: <strong>Classical Guitar & Vocals</strong>
                  </div>

                  {/* Perforation line */}
                  <div className="ticket-perforation"></div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--mustard-deep)', fontWeight: 700 }}>
                        In exchange, teaches
                      </span>
                      <h4 style={{ fontSize: '1.1rem', margin: '2px 0 0', color: 'var(--navy)' }}>Rohan Mehta</h4>
                    </div>
                    <span className="badge badge-gray" style={{ fontSize: '0.72rem' }}>5th Sem CSE</span>
                  </div>

                  <div style={{ background: 'var(--paper-subtle)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                    Skill offered: <strong>Python for Beginners & DSA</strong>
                  </div>
                </div>

                {/* Simulated Real-Time Popover Alert from Slide 11/13 */}
                <div
                  style={{
                    background: 'var(--navy)',
                    color: 'white',
                    padding: '12px 18px',
                    margin: '0 16px 16px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#14b8a6', fontWeight: 700, textTransform: 'uppercase' }}>
                      ⚡ Instant Match Detected
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#e2e8f0', marginTop: '2px' }}>
                      Ananya wants to learn Python — you teach it!
                    </div>
                  </div>
                  <Link to="/explore" className="btn btn-teal btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    Connect
                  </Link>
                </div>

                <div className="ticket-footer">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <Lock size={13} color="var(--teal)" /> Slot self-locking active
                  </div>
                  <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--navy)' }}>
                    Auto-matched via Skills Matrix
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--paper-deep)', padding: '28px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'Space Grotesk', color: 'var(--navy)' }}>
                {stats.studentsRegistered}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                students registered
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'Space Grotesk', color: 'var(--navy)' }}>
                {stats.skillsExchanged}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                skills listed
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'Space Grotesk', color: 'var(--navy)' }}>
                {stats.ratingAvg} ★
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                average swap rating
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'Space Grotesk', color: 'var(--navy)' }}>
                {stats.responseTimeAvg}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                average match response
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps Section From Slide 13 */}
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>
              Three steps from idle skill to booked session
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              No lengthy sign-up flow — just list, get matched, and book in a frame.
            </p>
          </div>

          <div className="grid-3">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>List your skills</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Add what you can teach and what you're hoping to pick up — from guitar to UI to graphic design.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                <Link to="/profile" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--teal)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Manage your skills <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Get matched instantly</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                The moment someone's 'teach' hits your 'learn' you're notified — no waiting for a weekly digest.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                <Link to="/explore" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--teal)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Open match engine <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Book and swap</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                Pick a slot on their live calendar, confirm over chat, and meet — the slot locks the second it's chosen.
              </p>
              <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                <Link to="/booking" style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--teal)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View live calendar <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Feature Band from Slide 13 */}
      <section className="container">
        <div className="dark-feature-band">
          <div className="dark-feature-item">
            <div style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={20} color="#14b8a6" />
            </div>
            <h4>Instant match alerts</h4>
            <p>
              The second someone lists a skill you want, you hear about it — not at the end of the week.
            </p>
          </div>

          <div className="dark-feature-item">
            <div style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={20} color="#eab308" />
            </div>
            <h4>A calendar that locks itself</h4>
            <p>
              Book a slot and it disappears for everyone else immediately — no double-booked sessions.
            </p>
          </div>

          <div className="dark-feature-item">
            <div style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={20} color="#38bdf8" />
            </div>
            <h4>Chat before you commit</h4>
            <p>
              Confirm the time, place, or video link with your match before either of you finalizes the swap.
            </p>
          </div>
        </div>
      </section>

      {/* REACT CLASS COMPONENT DEMO SECTION */}
      <section style={{ padding: '20px 0 50px' }}>
        <div className="container">
          <ClassActivityFeed maxItems={4} title="Campus Real-Time Stream (Class Component Demo)" />
        </div>
      </section>

      {/* Popular Skills Showcase from Slide 13 */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>
                Whatever you're good at, someone wants to learn it
              </h2>
              <p style={{ color: 'var(--text-muted)' }}>
                Popular categories students are trading right now on campus.
              </p>
            </div>
            <Link to="/explore" className="btn btn-secondary btn-sm">
              Explore All Skills
            </Link>
          </div>

          <div className="grid-3">
            {skills.slice(0, 6).map((sk) => (
              <div key={sk.skill_id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span className="badge badge-teal" style={{ marginBottom: '10px' }}>
                    {sk.category}
                  </span>
                  <h4 style={{ fontSize: '1.15rem', margin: '4px 0 8px', color: 'var(--navy)' }}>
                    {sk.skill_name}
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    {sk.description}
                  </p>
                </div>
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <Link
                    to={`/explore?category=${encodeURIComponent(sk.category)}`}
                    style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--navy)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    Find Peers <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign-Up CTA Box from Slide 13 */}
      <section style={{ padding: '20px 0 60px' }}>
        <div className="container">
          <div
            className="card"
            style={{
              background: 'var(--paper-subtle)',
              border: '1.5px solid var(--border)',
              padding: '48px',
              textAlign: 'center',
              maxWidth: '800px',
              margin: '0 auto'
            }}
          >
            <h2 style={{ fontSize: '2.4rem', marginBottom: '12px' }}>
              Your next skill is one swap away.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '28px' }}>
              Join with your college email and list your first skill in under two minutes.
            </p>

            {registeredSuccess ? (
              <div className="badge badge-teal" style={{ padding: '12px 24px', fontSize: '1rem' }}>
                <CheckCircle size={18} /> Welcome! Redirecting to your skill profile...
              </div>
            ) : (
              <form
                onSubmit={handleQuickJoin}
                style={{
                  display: 'flex',
                  gap: '12px',
                  maxWidth: '540px',
                  margin: '0 auto',
                  flexWrap: 'wrap'
                }}
              >
                <input
                  type="text"
                  placeholder="Full name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="form-input"
                  style={{ flex: 1, minWidth: '160px' }}
                  required
                />
                <input
                  type="email"
                  placeholder="College email (@rvu.edu.in)"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="form-input"
                  style={{ flex: 1.2, minWidth: '200px' }}
                  required
                />
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
                  Create my profile
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
