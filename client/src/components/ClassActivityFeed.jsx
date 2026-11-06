import React, { Component } from 'react';
import { Activity, Clock, Flame, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

/**
 * ClassActivityFeed Component
 * Requirement Sl. No. 2: Class Component Demonstration
 * Features:
 * - Uses ES6 Class extending React.Component
 * - Internal state managed via this.state and this.setState()
 * - Lifecycle methods: componentDidMount, componentDidUpdate, componentWillUnmount
 * - Event handling: onClick filter toggling, manual refresh, stream pause/resume
 * - Props receiving from parent component (initialFilter, maxItems, title)
 */
class ClassActivityFeed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: [
        {
          id: 101,
          type: 'swap_match',
          title: 'Mutual Match Detected',
          detail: 'Hemanth (React) ↔ Priya Nair (Classical Guitar)',
          location: 'RVU Campus SAC',
          time: '2 mins ago',
          badge: 'High Compatibility (98%)',
          badgeColor: 'badge-teal'
        },
        {
          id: 102,
          type: 'slot_lock',
          title: 'Calendar Slot Locked',
          detail: 'Namith Jain locked 3:00 PM slot for Python & DSA session',
          location: 'Library Pod 4',
          time: '5 mins ago',
          badge: 'Locked (Double-Booking Prevented)',
          badgeColor: 'badge-mustard'
        },
        {
          id: 103,
          type: 'session_done',
          title: 'Swap Completed & Reviewed',
          detail: 'Gnana Prakash completed UI/UX Figma Review with Namith',
          location: 'Design Lab 102',
          time: '12 mins ago',
          badge: '5.0 ★ Rating',
          badgeColor: 'badge-navy'
        },
        {
          id: 104,
          type: 'new_skill',
          title: 'New Skill Offered',
          detail: 'Ananya Sharma listed "Digital Photography & Lightroom"',
          location: 'Media Block',
          time: '20 mins ago',
          badge: 'Creative Arts',
          badgeColor: 'badge-gray'
        }
      ],
      filter: this.props.initialFilter || 'all',
      isLiveStreamActive: true,
      lastUpdated: new Date().toLocaleTimeString(),
      clickCount: 0
    };

    // Binding event handlers in constructor (Standard Class Component Pattern)
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.toggleStream = this.toggleStream.bind(this);
    this.refreshFeed = this.refreshFeed.bind(this);
    this.addSimulatedActivity = this.addSimulatedActivity.bind(this);
  }

  // Lifecycle Method: componentDidMount
  componentDidMount() {
    // Start automated live ticker interval simulating WebSocket campus events
    this.intervalId = setInterval(() => {
      if (this.state.isLiveStreamActive) {
        this.addSimulatedActivity();
      }
    }, 18000);
  }

  // Lifecycle Method: componentDidUpdate
  componentDidUpdate(prevProps, prevState) {
    if (prevState.activities.length !== this.state.activities.length) {
      // Activity feed state updated
    }
  }

  // Lifecycle Method: componentWillUnmount
  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Event Handler: Toggle live stream state
  toggleStream() {
    this.setState((prevState) => ({
      isLiveStreamActive: !prevState.isLiveStreamActive,
      clickCount: prevState.clickCount + 1
    }));
  }

  // Event Handler: Filter change
  handleFilterChange(newFilter) {
    this.setState({
      filter: newFilter,
      clickCount: this.state.clickCount + 1
    });
  }

  // Event Handler: Manual Refresh
  refreshFeed() {
    this.addSimulatedActivity();
    this.setState({
      lastUpdated: new Date().toLocaleTimeString(),
      clickCount: this.state.clickCount + 1
    });
  }

  // Helper to generate simulated campus activity
  addSimulatedActivity() {
    const mockEvents = [
      {
        type: 'swap_match',
        title: 'New Skill Exchange Request',
        detail: 'Rohan Mehta requested Python for Photography swap with Ananya',
        location: 'Tech Tower A',
        badge: 'New Request',
        badgeColor: 'badge-teal'
      },
      {
        type: 'slot_lock',
        title: 'Real-Time Slot Reserved',
        detail: 'Priya Nair locked 5:30 PM slot for Guitar Practice Room',
        location: 'Music Room 3',
        badge: 'Slot Locked (60s)',
        badgeColor: 'badge-mustard'
      },
      {
        type: 'session_done',
        title: 'Mentorship Confirmed',
        detail: 'Hemanth confirmed React Hooks review session with Gnana',
        location: 'SAC Discussion Table',
        badge: 'Confirmed',
        badgeColor: 'badge-navy'
      }
    ];

    const randomPick = mockEvents[Math.floor(Math.random() * mockEvents.length)];
    const newItem = {
      ...randomPick,
      id: Date.now(),
      time: 'Just now'
    };

    this.setState((prevState) => ({
      activities: [newItem, ...prevState.activities.slice(0, (this.props.maxItems || 6) - 1)],
      lastUpdated: new Date().toLocaleTimeString()
    }));
  }

  render() {
    const { filter, activities, isLiveStreamActive, lastUpdated, clickCount } = this.state;
    const { title = 'Live Campus Activity Feed' } = this.props;

    const filteredList = activities.filter((item) => {
      if (filter === 'all') return true;
      return item.type === filter;
    });

    return (
      <div className="card" style={{ border: '1.5px solid var(--border)', background: '#ffffff' }}>
        {/* Class Component Identification Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-dot"></span>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{title}</h3>
              <span className="badge badge-teal" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
                <ShieldCheck size={12} /> React Class Component
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Demonstrating React Class Lifecycle (componentDidMount, this.state, this.setState)
            </p>
          </div>

          {/* Controls: Stream Pause & Refresh */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={this.toggleStream}
              className={`btn btn-sm ${isLiveStreamActive ? 'btn-secondary' : 'btn-primary'}`}
              title="Pause or Resume Live Stream"
            >
              <Zap size={14} color={isLiveStreamActive ? '#10b981' : '#94a3b8'} />
              {isLiveStreamActive ? 'Streaming Live' : 'Paused'}
            </button>
            <button
              onClick={this.refreshFeed}
              className="btn btn-sm btn-secondary"
              title="Trigger simulated live event"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['all', 'swap_match', 'slot_lock', 'session_done'].map((fKey) => {
            const labels = {
              all: 'All Events',
              swap_match: 'Matches & Swaps',
              slot_lock: 'Slot Locks',
              session_done: 'Completed'
            };
            const active = filter === fKey;
            return (
              <button
                key={fKey}
                onClick={() => this.handleFilterChange(fKey)}
                style={{
                  background: active ? 'var(--navy)' : 'var(--paper-subtle)',
                  color: active ? '#ffffff' : 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {labels[fKey]}
              </button>
            );
          })}
        </div>

        {/* Feed List Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredList.map((act) => (
            <div
              key={act.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--paper-subtle)',
                border: '1px solid rgba(228, 222, 203, 0.6)',
                transition: 'background 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: act.type === 'slot_lock' ? 'var(--mustard-light)' : act.type === 'swap_match' ? 'var(--teal-light)' : '#e0e7ff',
                    color: act.type === 'slot_lock' ? 'var(--mustard-deep)' : act.type === 'swap_match' ? 'var(--teal)' : '#3730a3',
                    marginTop: '2px'
                  }}
                >
                  {act.type === 'slot_lock' ? <Clock size={16} /> : act.type === 'swap_match' ? <Flame size={16} /> : <Activity size={16} />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--navy)' }}>
                      {act.title}
                    </span>
                    <span className={`badge ${act.badgeColor}`} style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                      {act.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text)', marginTop: '2px', marginBottom: '2px' }}>
                    {act.detail}
                  </p>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    📍 {act.location}
                  </span>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                {act.time}
              </span>
            </div>
          ))}
        </div>

        {/* Footer State Indicators */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', fontSize: '0.76rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
          <span>State Updates: {clickCount} user interactions</span>
          <span>Last sync: {lastUpdated}</span>
        </div>
      </div>
    );
  }
}

export default ClassActivityFeed;
