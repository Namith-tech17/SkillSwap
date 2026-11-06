import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Database,
  PlayCircle,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Lock,
  Sparkles,
  Users,
  Calendar,
  MessageSquare,
  Award,
  ExternalLink,
  GitBranch,
  Terminal
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const DemoPage = () => {
  const navigate = useNavigate();
  const { currentUser, switchUser, setAuthModalOpen } = useAuth();

  const [activeTab, setActiveTab] = useState('demo'); // 'demo' | 'database' | 'security' | 'deployment'

  // Verification states
  const [dbReport, setDbReport] = useState(null);
  const [dbLoading, setDbLoading] = useState(false);

  const [secReport, setSecReport] = useState(null);
  const [secLoading, setSecLoading] = useState(false);

  // Guided demo active step
  const [demoStep, setDemoStep] = useState(1);

  // Auto-run verification on mount
  useEffect(() => {
    fetchDbVerification();
    fetchSecVerification();
  }, []);

  const fetchDbVerification = async () => {
    setDbLoading(true);
    try {
      const data = await api.getDatabaseVerification();
      setDbReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setDbLoading(false);
    }
  };

  const fetchSecVerification = async () => {
    setSecLoading(true);
    try {
      const data = await api.getSecurityVerification();
      setSecReport(data);
    } catch (e) {
      console.error(e);
    } finally {
      setSecLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-teal">
            <Sparkles size={14} /> Evaluation & Verification Suite
          </span>
          <span className="badge badge-mustard">
            <ShieldCheck size={14} /> Criteria 3, 4 & 5 Verification
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Verification & Project Demo Center
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '820px' }}>
          Interactive dashboard to verify Database Schemas & Integrity (Criteria 3), Authentication & Bcrypt/JWT Security (Criteria 4), and Live Deployment & Guided Project Demonstration (Criteria 5).
        </p>
      </div>

      {/* Tabs */}
      <div className="tab-list">
        <button
          onClick={() => setActiveTab('demo')}
          className={`tab-btn ${activeTab === 'demo' ? 'active' : ''}`}
        >
          <PlayCircle size={15} style={{ display: 'inline', marginRight: '6px' }} />
          1. Interactive Project Demo Tour
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`tab-btn ${activeTab === 'database' ? 'active' : ''}`}
        >
          <Database size={15} style={{ display: 'inline', marginRight: '6px' }} />
          2. Database Design & Testing (Criteria 3)
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
        >
          <ShieldCheck size={15} style={{ display: 'inline', marginRight: '6px' }} />
          3. Authentication & Security (Criteria 4)
        </button>
        <button
          onClick={() => setActiveTab('deployment')}
          className={`tab-btn ${activeTab === 'deployment' ? 'active' : ''}`}
        >
          <Server size={15} style={{ display: 'inline', marginRight: '6px' }} />
          4. Deployment & Repositories (Criteria 5)
        </button>
      </div>

      {/* TAB 1: INTERACTIVE DEMO TOUR */}
      {activeTab === 'demo' && (
        <div>
          <div className="card" style={{ marginBottom: '32px', background: 'var(--navy)', color: '#ffffff', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="badge badge-teal" style={{ marginBottom: '8px' }}>
                  Guided Evaluation Mode
                </span>
                <h2 style={{ color: '#ffffff', fontSize: '1.8rem', margin: '4px 0 8px' }}>
                  Interactive 5-Step Project Demonstration
                </h2>
                <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '680px' }}>
                  Follow this guided sequence to experience the full peer learning lifecycle: authentication, mutual matching, self-locking calendar booking, real-time coordination chat, and verified peer reviews.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Currently acting as:</span>
                <span className="badge badge-mustard" style={{ fontSize: '0.82rem' }}>
                  {currentUser?.name || 'Hemanth B Y'}
                </span>
              </div>
            </div>

            {/* Stepper Progress */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '28px' }}>
              {[
                { step: 1, title: 'Authenticate Role', desc: 'JWT & bcrypt credentials' },
                { step: 2, title: 'Explore Matches', desc: '98% Mutual Match algorithm' },
                { step: 3, title: 'Lock Slot & Book', desc: '60s anti-double-booking lock' },
                { step: 4, title: 'Peer Chat', desc: 'In-app exchange coordination' },
                { step: 5, title: 'Complete & Review', desc: 'Verified 1-5 star rating' }
              ].map((s) => (
                <div
                  key={s.step}
                  onClick={() => setDemoStep(s.step)}
                  style={{
                    background: demoStep === s.step ? 'rgba(20, 184, 166, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1.5px solid ${demoStep === s.step ? 'var(--teal)' : 'rgba(255, 255, 255, 0.1)'}`,
                    borderRadius: '10px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: demoStep >= s.step ? 'var(--teal)' : 'rgba(255,255,255,0.2)',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {s.step}
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{s.title}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Action Card */}
          <div className="card" style={{ padding: '32px' }}>
            {demoStep === 1 && (
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Lock size={20} color="var(--teal)" /> Step 1: Authenticate with JWT & Bcrypt
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
                  SkillSwap uses 10-round salted bcrypt password hashing and HMAC-SHA256 JWT tokens. You can sign in with your student credentials or use 1-click fast demo switching between RV University peers.
                </p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  <button onClick={() => setAuthModalOpen(true)} className="btn btn-primary">
                    Open Sign In / Register Modal
                  </button>
                  <button onClick={() => switchUser('usr_1')} className="btn btn-secondary btn-sm">
                    Switch to Hemanth (React Mentor)
                  </button>
                  <button onClick={() => switchUser('usr_2')} className="btn btn-secondary btn-sm">
                    Switch to Priya (Guitar Mentor)
                  </button>
                </div>

                <div style={{ background: 'var(--paper-subtle)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.84rem' }}>
                  <strong>Current Active Session:</strong> {currentUser?.name} ({currentUser?.usn}) • {currentUser?.email}
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setDemoStep(2)} className="btn btn-teal">
                    Next: Explore Mutual Matches →
                  </button>
                </div>
              </div>
            )}

            {demoStep === 2 && (
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={20} color="var(--teal)" /> Step 2: Intelligent Skill Matching Engine
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
                  The matching engine compares what you teach against peer wishlists and what peers teach against your wishlist. Notice how <strong>Priya Nair</strong> has a <strong>98% Mutual Match (Two-Way Swap)</strong> with Hemanth!
                </p>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <button onClick={() => navigate('/explore')} className="btn btn-primary">
                    Launch Match Engine Page
                  </button>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => setDemoStep(1)} className="btn btn-secondary">
                    ← Back to Step 1
                  </button>
                  <button onClick={() => setDemoStep(3)} className="btn btn-teal">
                    Next: Test Live Slot Locking →
                  </button>
                </div>
              </div>
            )}

            {demoStep === 3 && (
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} color="var(--teal)" /> Step 3: Live Calendar & 60-Second Self-Locking Concurrency
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
                  To prevent double-booking across concurrent campus users, clicking an available slot immediately reserves it on the backend for 60 seconds with an active countdown timer.
                </p>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <button onClick={() => navigate('/booking')} className="btn btn-primary">
                    Open Live Calendar & Book Slot
                  </button>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => setDemoStep(2)} className="btn btn-secondary">
                    ← Back to Step 2
                  </button>
                  <button onClick={() => setDemoStep(4)} className="btn btn-teal">
                    Next: Test Peer Chat →
                  </button>
                </div>
              </div>
            )}

            {demoStep === 4 && (
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={20} color="var(--teal)" /> Step 4: In-App Peer Coordination Chat
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
                  Coordinate exchange topics, discuss room venues (Library Pods, SAC), or confirm Google Meet links before meeting.
                </p>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <button onClick={() => navigate('/chat')} className="btn btn-primary">
                    Open In-App Chat
                  </button>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => setDemoStep(3)} className="btn btn-secondary">
                    ← Back to Step 3
                  </button>
                  <button onClick={() => setDemoStep(5)} className="btn btn-teal">
                    Next: Session Completion & Review →
                  </button>
                </div>
              </div>
            )}

            {demoStep === 5 && (
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={20} color="var(--teal)" /> Step 5: Session Completion & Verified Peer Reviews
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
                  Track swap history, mark held sessions as completed, and submit verified 1-5 star peer feedback.
                </p>

                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                  <button onClick={() => navigate('/sessions')} className="btn btn-primary">
                    Open My Sessions & Reviews
                  </button>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => setDemoStep(4)} className="btn btn-secondary">
                    ← Back to Step 4
                  </button>
                  <button onClick={() => setActiveTab('database')} className="btn btn-teal">
                    View Database Verification Report →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DATABASE VERIFICATION (CRITERIA 3) */}
      {activeTab === 'database' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Database Design, Schemas & Integrity Testing</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                Verifies Mongoose schema validation constraints, relational foreign keys, rating boundaries, and collection health.
              </p>
            </div>
            <button onClick={fetchDbVerification} disabled={dbLoading} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} className={dbLoading ? 'animate-spin' : ''} /> Re-run Database Tests
            </button>
          </div>

          {/* Database Status Banner */}
          {dbReport && (
            <div
              style={{
                background: dbReport.overallStatus === 'PASSED' ? '#f0fdf4' : '#fef2f2',
                border: `1.5px solid ${dbReport.overallStatus === 'PASSED' ? '#22c55e' : '#ef4444'}`,
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={20} color="#16a34a" />
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#14532d' }}>
                    Database Verification Status: {dbReport.overallStatus}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#166534', marginTop: '4px' }}>
                  Engine Mode: <strong>{dbReport.connectionMode}</strong>
                </div>
              </div>

              {dbReport.stats && (
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', color: '#14532d' }}>
                  <span>Students: <strong>{dbReport.stats.users}</strong></span>
                  <span>Skills: <strong>{dbReport.stats.skills}</strong></span>
                  <span>Sessions: <strong>{dbReport.stats.sessions}</strong></span>
                  <span>Slots: <strong>{dbReport.stats.slots}</strong></span>
                </div>
              )}
            </div>
          )}

          {/* Test Case Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
            {dbReport?.tests?.map((t) => (
              <div
                key={t.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-navy" style={{ fontSize: '0.72rem' }}>{t.id}</span>
                    <h4 style={{ margin: 0, fontSize: '0.98rem' }}>{t.title}</h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', marginBottom: 0 }}>
                    {t.detail}
                  </p>
                </div>
                <span className={`badge ${t.status === 'PASSED' ? 'badge-teal' : 'badge-mustard'}`} style={{ flexShrink: 0 }}>
                  {t.status === 'PASSED' ? '✔ PASSED' : '✖ FAILED'}
                </span>
              </div>
            ))}
          </div>

          {/* Mongoose Registered Schemas */}
          <div className="card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Registered Mongoose Schemas (Slide 8 Compliance)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {dbReport?.schemas?.map((s) => (
                <div key={s.name} style={{ background: 'var(--paper-subtle)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--navy)' }}>{s.name} Schema</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.pathCount} defined fields</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & AUTHENTICATION (CRITERIA 4) */}
      {activeTab === 'security' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', margin: 0 }}>Authentication & Security Review Suite</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '4px' }}>
                Verifies password hashing via 10-round salted bcrypt, cryptographic JWT issuance, token tampering defenses, and timeout expirations.
              </p>
            </div>
            <button onClick={fetchSecVerification} disabled={secLoading} className="btn btn-secondary btn-sm">
              <RefreshCw size={14} className={secLoading ? 'animate-spin' : ''} /> Re-run Security Tests
            </button>
          </div>

          {/* Security Banner */}
          {secReport && (
            <div
              style={{
                background: secReport.overallStatus === 'PASSED' ? '#f0fdf4' : '#fef2f2',
                border: `1.5px solid ${secReport.overallStatus === 'PASSED' ? '#22c55e' : '#ef4444'}`,
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={20} color="#16a34a" />
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#14532d' }}>
                    Security Review Status: {secReport.overallStatus}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#166534', marginTop: '4px' }}>
                  Algorithms: <strong>{secReport.hashingAlgorithm}</strong> • <strong>{secReport.tokenAlgorithm}</strong> (Expiry: {secReport.tokenExpiry})
                </div>
              </div>

              <span className="badge badge-teal">All Defense Checks Active</span>
            </div>
          )}

          {/* Security Test Cases */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
            {secReport?.tests?.map((t) => (
              <div
                key={t.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-navy" style={{ fontSize: '0.72rem' }}>{t.id}</span>
                    <h4 style={{ margin: 0, fontSize: '0.98rem' }}>{t.title}</h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', marginBottom: 0 }}>
                    {t.detail}
                  </p>
                </div>
                <span className={`badge ${t.status === 'PASSED' ? 'badge-teal' : 'badge-mustard'}`} style={{ flexShrink: 0 }}>
                  {t.status === 'PASSED' ? '✔ PASSED' : '✖ FAILED'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DEPLOYMENT & REPOSITORIES (CRITERIA 5) */}
      {activeTab === 'deployment' && (
        <div>
          <div className="card" style={{ padding: '32px', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Server size={22} color="var(--teal)" /> Live Deployment & Containerization (Criteria 5)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
              SkillSwap is production-ready with infrastructure configurations for Vercel, Render, and Docker Compose.
            </p>

            <div className="grid-3" style={{ marginBottom: '28px' }}>
              <div style={{ background: 'var(--paper-subtle)', border: '1px solid var(--border)', borderRadius: '10px', padding: '18px' }}>
                <h4 style={{ fontSize: '1.05rem', margin: '0 0 6px', color: 'var(--navy)' }}>Frontend: Vercel</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Configured with `client/vercel.json` for SPA URL rewrites and instant CDN delivery.
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--teal)', fontWeight: 600, marginTop: '8px' }}>
                  Ready to deploy via git push
                </div>
              </div>

              <div style={{ background: 'var(--paper-subtle)', border: '1px solid var(--border)', borderRadius: '10px', padding: '18px' }}>
                <h4 style={{ fontSize: '1.05rem', margin: '0 0 6px', color: 'var(--navy)' }}>Backend: Render</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Infrastructure as Code defined in `render.yaml` blueprint with environment variable mapping.
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--teal)', fontWeight: 600, marginTop: '8px' }}>
                  Auto-deploys on git commit
                </div>
              </div>

              <div style={{ background: 'var(--paper-subtle)', border: '1px solid var(--border)', borderRadius: '10px', padding: '18px' }}>
                <h4 style={{ fontSize: '1.05rem', margin: '0 0 6px', color: 'var(--navy)' }}>Docker Compose</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Multi-stage `Dockerfile` and `docker-compose.yml` for unified app + MongoDB container stack.
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--teal)', fontWeight: 600, marginTop: '8px' }}>
                  Run: docker-compose up
                </div>
              </div>
            </div>

            {/* CLI Verification Commands */}
            <div style={{ background: 'var(--navy)', color: '#ffffff', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontSize: '0.86rem', color: '#14b8a6', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={16} /> Automated Verification CLI Commands:
              </div>
              <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.8 }}>
                # Run Database Validation Tests (Mongoose Schemas & Relational Integrity)<br />
                npm run test:db<br /><br />
                # Run Security & Auth Verification (Bcrypt Salt & JWT HMAC-SHA256)<br />
                npm run test:security<br /><br />
                # Run All Tests Simultaneously<br />
                npm run test:all
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoPage;
