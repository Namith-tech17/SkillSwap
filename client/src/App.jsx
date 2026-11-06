import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationToast from './components/NotificationToast';
import AuthModal from './components/AuthModal';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import ExploreMatchesPage from './pages/ExploreMatchesPage';
import LiveCalendarPage from './pages/LiveCalendarPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import SessionsPage from './pages/SessionsPage';
import AboutArchitecturePage from './pages/AboutArchitecturePage';
import DemoPage from './pages/DemoPage';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        The page you are looking for does not exist on the SkillSwap platform.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExploreMatchesPage />} />
                  <Route path="/booking" element={<LiveCalendarPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/sessions" element={<SessionsPage />} />
                  <Route path="/demo" element={<DemoPage />} />
                  <Route path="/about" element={<AboutArchitecturePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <NotificationToast />
              <AuthModal />
              <Footer />
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
