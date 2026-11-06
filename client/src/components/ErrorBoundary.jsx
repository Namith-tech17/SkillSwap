import React, { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * ErrorBoundary Component
 * React Class Component implementing error boundaries:
 * - getDerivedStateFromError
 * - componentDidCatch
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '600px', margin: '40px auto' }} className="card">
          <div style={{ color: '#ef4444', marginBottom: '16px' }}>
            <AlertTriangle size={48} style={{ margin: '0 auto' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
            An unexpected error occurred in the React component tree.
          </p>
          <button onClick={this.handleReset} className="btn btn-primary">
            <RefreshCw size={16} /> Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
