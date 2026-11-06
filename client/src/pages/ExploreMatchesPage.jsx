import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles, RefreshCw, CheckCircle2, UserCheck } from 'lucide-react';
import PeerCard from '../components/PeerCard';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const ExploreMatchesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const { currentUser } = useAuth();
  const { addNotification } = useNotification();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [matchTypeFilter, setMatchTypeFilter] = useState('All'); // 'All', 'Mutual', 'Mentor', 'Mentee'

  // Fetch matches from Express API on user or category change
  useEffect(() => {
    async function fetchMatches() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const data = await api.getMatches(currentUser.user_id);
        setMatches(data);
      } catch (err) {
        console.error('Failed to fetch matches:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, [currentUser]);

  // Handle starting a chat
  const handleStartChat = (peer) => {
    navigate(`/chat?peerId=${peer.user_id}`);
  };

  // Handle booking slot
  const handleSelectForBooking = (peer) => {
    navigate(`/booking?teacherId=${peer.user_id}`);
  };

  // Filter logic
  const filteredMatches = matches.filter((m) => {
    const peer = m.peer;
    const nameMatch = peer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const skillsTeachMatch = peer.skills_teach.some((s) =>
      s.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const skillsLearnMatch = peer.skills_learn.some((s) =>
      s.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesSearch = nameMatch || skillsTeachMatch || skillsLearnMatch;

    const matchesCategory =
      selectedCategory === 'All' ||
      peer.skills_teach.some((s) => s.category === selectedCategory || s.skill_name.includes(selectedCategory));

    const matchesType =
      matchTypeFilter === 'All' ||
      (matchTypeFilter === 'Mutual' && m.matchType.includes('Mutual')) ||
      (matchTypeFilter === 'Mentor' && m.matchType.includes('Mentor')) ||
      (matchTypeFilter === 'Mentee' && m.matchType.includes('Mentee'));

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge badge-teal">
            <Sparkles size={14} /> Intelligent Matching Engine
          </span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Comparing skills for: <strong>{currentUser?.name}</strong>
          </span>
        </div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          Find Compatible Skill Partners
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '720px' }}>
          The platform evaluates what you teach against what others want to learn, and vice-versa, calculating real-time compatibility scores for seamless two-way knowledge exchange.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div
        className="card"
        style={{
          marginBottom: '32px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search by student name, skill (e.g. React, Guitar, Photography)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          {/* Match Type Quick Filter */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Mutual', 'Mentor', 'Mentee'].map((type) => (
              <button
                key={type}
                onClick={() => setMatchTypeFilter(type)}
                className={`btn btn-sm ${matchTypeFilter === type ? 'btn-primary' : 'btn-secondary'}`}
              >
                {type === 'Mutual' ? '⚡ Two-Way Swaps' : type === 'All' ? 'All Matches' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            Category:
          </span>
          {['All', 'Programming', 'Design', 'Creative Arts', 'Music & Arts', 'Data Science'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? 'var(--teal)' : 'var(--paper-subtle)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--navy)',
                border: '1px solid var(--border)',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Match Results Count */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.25rem' }}>
          Matches Found ({filteredMatches.length})
        </h3>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--teal)', fontSize: '0.85rem' }}>
            <RefreshCw size={14} className="animate-spin" /> Calculating compatibility...
          </div>
        )}
      </div>

      {/* Results Grid */}
      {filteredMatches.length === 0 && !loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <UserCheck size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No matching peers found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Try clearing filters or search terms, or add more skills to your profile.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setMatchTypeFilter('All');
            }}
            className="btn btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid-3">
          {filteredMatches.map((m) => (
            <PeerCard
              key={m.match_id}
              peer={m.peer}
              matchType={m.matchType}
              compatibility={m.compatibility}
              onSelectForBooking={handleSelectForBooking}
              onStartChat={handleStartChat}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreMatchesPage;
