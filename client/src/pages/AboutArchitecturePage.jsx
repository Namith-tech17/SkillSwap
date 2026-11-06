import React from 'react';
import {
  GraduationCap,
  Layers,
  Database,
  Server,
  Monitor,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  GitBranch,
  Network
} from 'lucide-react';

const AboutArchitecturePage = () => {
  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-teal">
            <GraduationCap size={14} /> RV University • CS3301 Full Stack Development
          </span>
          <span className="badge badge-mustard">5th Semester SEE Project</span>
        </div>
        <h1 style={{ fontSize: '2.6rem', marginBottom: '8px' }}>
          System Architecture & Technical Design
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '800px' }}>
          Comprehensive documentation of SkillSwap's architectural layers, data schema, real-time concurrency controls, and course requirements compliance.
        </p>
      </div>

      {/* Project Team Card from Slide 1 */}
      <div className="card" style={{ marginBottom: '36px', background: 'var(--navy)', color: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#14b8a6', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Course Project Submission
            </span>
            <h2 style={{ color: '#ffffff', fontSize: '1.8rem', margin: '4px 0 10px' }}>
              SkillSwap — Real-Time Peer Learning & Mentorship Platform
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', maxWidth: '640px' }}>
              RV University — School of Computer Science & Engineering • 5th Semester
            </p>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '16px 24px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <div style={{ fontSize: '0.86rem', color: '#38bdf8', fontWeight: 700, marginBottom: '8px' }}>
              TEAM MEMBERS:
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem' }}>
              <li>• <strong>Hemanth B Y</strong> — 1RUA24SCS0041</li>
              <li>• <strong>C Namith Jain</strong> — 1RUA24SCS0021</li>
              <li>• <strong>N Gnana Prakash</strong> — 1RUA24SCS0062</li>
            </ul>
          </div>
        </div>
      </div>

      {/* System Architecture Diagram (Slide 6) */}
      <div className="card" style={{ marginBottom: '36px', padding: '32px' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Network size={22} color="var(--teal)" /> System Architecture (from Slide 6)
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px' }}>
          Three-tier decoupled client-server architecture with REST endpoints and real-time slot concurrency synchronization.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {/* Tier 1: Client */}
          <div style={{ background: 'var(--paper-subtle)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', background: 'var(--teal-light)', color: 'var(--teal)', borderRadius: '8px' }}>
                <Monitor size={20} />
              </div>
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>[Client - Browser]</h4>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              • Modern SPA built with React 18 & Vite<br />
              • Client-side routing via React Router DOM<br />
              • Component hierarchy: Functional & Class Components<br />
              • Responsive UI with CSS Grid & Flexbox
            </div>
          </div>

          {/* Tier 2: API Server */}
          <div style={{ background: 'var(--paper-subtle)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', background: 'var(--mustard-light)', color: 'var(--mustard-deep)', borderRadius: '8px' }}>
                <Server size={20} />
              </div>
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>[Backend: Node / Express]</h4>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              • Express.js REST API with CORS middleware<br />
              • Intelligent Skill Matchmaking Engine<br />
              • Real-time slot locking with 60-second expiration cleaner<br />
              • Endpoints for auth, skills, slots, sessions, chat, feedback
            </div>
          </div>

          {/* Tier 3: Database Schema */}
          <div style={{ background: 'var(--paper-subtle)', border: '1.5px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', background: '#ede9fe', color: '#6d28d9', borderRadius: '8px' }}>
                <Database size={20} />
              </div>
              <h4 style={{ margin: 0, fontSize: '1.1rem' }}>[Data Store: JSON / MongoDB]</h4>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              • Structured schema with 8 relational tables<br />
              • Normalized tables for UsersSkillsTeach & UsersSkillsLearn<br />
              • Concurrency-safe slot status states<br />
              • Persistent review & feedback ratings
            </div>
          </div>
        </div>
      </div>

      {/* Database Schema Table from Slide 8 */}
      <div className="card" style={{ marginBottom: '36px', padding: '32px' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={22} color="var(--teal)" /> Database Schema (from Slide 8)
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
          Exact schema mapping defined in project presentation Slide 8.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--navy)', color: '#ffffff' }}>
                <th style={{ padding: '12px 16px', borderRadius: '6px 0 0 6px' }}>Table / Collection</th>
                <th style={{ padding: '12px 16px', borderRadius: '0 6px 6px 0' }}>Key Fields & Datatypes</th>
              </tr>
            </thead>
            <tbody>
              {[
                { table: 'Users', fields: 'user_id, name, email, usn, password_hash, bio, rating_avg, department, semester' },
                { table: 'Skills', fields: 'skill_id, skill_name, category, description' },
                { table: 'UsersSkillsTeach', fields: 'user_id, skill_id, proficiency_level (Beginner / Intermediate / Advanced), description' },
                { table: 'UsersSkillsLearn', fields: 'user_id, skill_id, priority (High / Medium / Low), notes' },
                { table: 'Matches', fields: 'match_id, teacher_id, learner_id, skill_id, status, compatibility_score' },
                { table: 'Sessions', fields: 'session_id, match_id, teacher_id, learner_id, scheduled_time, meeting_mode, status' },
                { table: 'Messages', fields: 'message_id, match_id, sender_id, text, timestamp' },
                { table: 'Feedback', fields: 'feedback_id, session_id, rating, comment, given_by, received_by' }
              ].map((row, idx) => (
                <tr key={row.table} style={{ borderBottom: '1px solid var(--border)', background: idx % 2 === 0 ? '#ffffff' : 'var(--paper-subtle)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--navy)' }}>{row.table}</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.85rem' }}>{row.fields}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Evaluation Matrix (12 Criteria Verification) */}
      <div className="card" style={{ padding: '32px' }}>
        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={22} color="#10b981" /> Minimum Technical Requirements Compliance Matrix
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
          Demonstration of all 12 React.js and Full Stack development concepts mandated by the course assignment.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ background: 'var(--paper-deep)', color: 'var(--navy)', borderBottom: '2px solid var(--border)' }}>
                <th style={{ padding: '10px 14px' }}>#</th>
                <th style={{ padding: '10px 14px' }}>Concept</th>
                <th style={{ padding: '10px 14px' }}>Assignment Requirement</th>
                <th style={{ padding: '10px 14px' }}>Implementation in SkillSwap</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { no: 1, concept: 'Components', req: 'Divided into reusable components', impl: 'Navbar, Footer, PeerCard, SkillBadge, SlotLockTimer, LiveMatchTicker, RatingStars' },
                { no: 2, concept: 'Class Component', req: 'At least one class component', impl: 'ClassActivityFeed.jsx (demonstrates this.state, componentDidMount, componentWillUnmount, componentDidUpdate) & ErrorBoundary.jsx' },
                { no: 3, concept: 'Functional Components', req: 'Used for major UI sections', impl: 'HomePage, ExploreMatchesPage, LiveCalendarPage, ChatPage, ProfilePage, SessionsPage' },
                { no: 4, concept: 'Parent–Child', req: 'Data passed between parent & child', impl: 'ExploreMatchesPage passes peer object & click handlers to PeerCard; SessionsPage passes rating to RatingStars' },
                { no: 5, concept: 'Props', req: 'Props used to pass data/configuration', impl: 'SkillBadge props (name, category, level, type, onRemove); SlotLockTimer props (initialSeconds, onExpire)' },
                { no: 6, concept: 'useState', req: 'State managed using useState', impl: 'Used for booking slots, lock countdowns, chat messages, search queries, active tabs, profile form fields' },
                { no: 7, concept: 'useEffect', req: 'Used for appropriate side effects', impl: 'API data fetching, slot lock countdown intervals, chat auto-scroll & polling cleanup' },
                { no: 8, concept: 'Event Handling', req: 'Click, change, submit handled', impl: 'onClick slot lock, onChange form fields, onSubmit booking & review forms, onKeyDown chat send' },
                { no: 9, concept: 'Form Handling', req: 'At least one functional form', impl: '1. Session Booking Form; 2. Profile & Skill Registration Form; 3. Peer Review & Rating Modal Form' },
                { no: 10, concept: 'Client-Side Routing', req: 'Multiple views via React Router', impl: 'React Router DOM with routes /, /explore, /booking, /chat, /profile, /sessions, /about' },
                { no: 11, concept: 'Responsive UI', req: 'Works reasonably on different screen sizes', impl: 'Mobile-friendly responsive grid layout, flex wrapping, CSS media queries, Space Grotesk styling' },
                { no: 12, concept: 'Backend Server', req: 'Express.js concept & methods for API', impl: 'Express REST API with middleware, routes for auth, skills, matches, slots locking, sessions, chat, feedback' }
              ].map((row) => (
                <tr key={row.no} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 700 }}>{row.no}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--navy)' }}>{row.concept}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>{row.req}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text)' }}>{row.impl}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span className="badge badge-teal" style={{ fontSize: '0.74rem' }}>
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AboutArchitecturePage;
