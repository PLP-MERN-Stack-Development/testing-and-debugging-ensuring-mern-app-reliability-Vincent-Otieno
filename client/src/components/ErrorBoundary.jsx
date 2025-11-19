import React, { Component } from 'react';
import './ErrorBoundary.css';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree and displays a fallback UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by ErrorBoundary:', error, errorInfo);

    // You can also log the error to an error reporting service
    this.logErrorToService(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  logErrorToService = (error, errorInfo) => {
    // In a real application, you would send this to an error reporting service
    // like Sentry, LogRocket, or your own logging API
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error logging service
      // errorLoggingService.log({ error, errorInfo });
    }
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      const { fallback } = this.props;

      if (fallback) {
        return fallback;
      }

      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1 className="error-boundary-title">Oops! Something went wrong</h1>
            <p className="error-boundary-message">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-boundary-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="error-boundary-actions">
              <button
                onClick={this.handleReset}
                className="error-boundary-button"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="error-boundary-button error-boundary-button-secondary"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
