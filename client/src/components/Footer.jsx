import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Code, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--navy)', color: '#ffffff', borderTop: '1px solid var(--border-dark)', marginTop: '60px' }}>
      <div className="container" style={{ padding: '48px 24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '36px', marginBottom: '36px' }}>
          {/* Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '30px', height: '30px', background: 'var(--teal)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} color="#fff" />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Space Grotesk' }}>SkillSwap</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Real-Time Peer Learning & Mentorship Platform for Campus Communities. Built to eliminate fragmented WhatsApp groups with live matchmaking, self-locking calendars, and peer accountability.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-teal" style={{ fontSize: '0.74rem' }}>React 18</span>
              <span className="badge badge-mustard" style={{ fontSize: '0.74rem' }}>Express API</span>
              <span className="badge badge-gray" style={{ fontSize: '0.74rem' }}>Node.js</span>
              <span className="badge badge-gray" style={{ fontSize: '0.74rem' }}>REST Architecture</span>
            </div>
          </div>

          {/* Academic Project Credits (From PPT) */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GraduationCap size={18} color="#14b8a6" /> Course Project Details
            </h4>
            <p style={{ color: '#cbd5e1', fontSize: '0.86rem', fontWeight: 600, marginBottom: '4px' }}>
              CS3301 FULL STACK DEVELOPMENT
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: '12px' }}>
              RV UNIVERSITY — School of Computer Science & Engineering
            </p>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600, marginBottom: '6px' }}>Team Members (5th Semester):</div>
              <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>• Hemanth B Y — <span style={{ color: '#38bdf8' }}>1RUA24SCS0041</span></li>
                <li>• C Namith Jain — <span style={{ color: '#38bdf8' }}>1RUA24SCS0021</span></li>
                <li>• N Gnana Prakash — <span style={{ color: '#38bdf8' }}>1RUA24SCS0062</span></li>
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '14px' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
              <li><Link to="/explore" style={{ color: '#94a3b8', textDecoration: 'none' }}>→ Skill Matching Engine</Link></li>
              <li><Link to="/booking" style={{ color: '#94a3b8', textDecoration: 'none' }}>→ Live Calendar & Slot Locking</Link></li>
              <li><Link to="/chat" style={{ color: '#94a3b8', textDecoration: 'none' }}>→ In-App Peer Chat</Link></li>
              <li><Link to="/sessions" style={{ color: '#94a3b8', textDecoration: 'none' }}>→ Session History & Feedback</Link></li>
              <li><Link to="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>→ System Architecture & PPT Walkthrough</Link></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: '#64748b' }}>
          <div>
            © 2026 SkillSwap Platform. Built for RV University Full Stack Development SEE Evaluation.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Demonstrates all 12 React & Express assignment criteria</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
