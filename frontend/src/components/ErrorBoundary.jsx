import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <div className="error-code">500</div>
          <h1>Something Went Wrong</h1>
          <p>An unexpected error occurred. Please try refreshing the page.</p>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => { this.setState({ hasError: false }); window.location.href = '/dashboard'; }}
            style={{ display: 'inline-flex' }}
          >
            Back to Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
