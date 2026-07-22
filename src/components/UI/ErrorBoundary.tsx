import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

/**
 * Catches rendering errors anywhere in the child tree and shows a fallback,
 * ensuring the application never shows a blank white screen.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // In a real app this would report to an error-tracking service.
    console.error('Uncaught error:', error, info);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, message: '' });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="placeholder" style={{ height: '100vh' }}>
          <div className="placeholder__inner">
            <div className="placeholder__icon">⚠️</div>
            <h2 style={{ marginBottom: 8 }}>Something went wrong</h2>
            <p style={{ marginBottom: 18, color: 'var(--text-muted)' }}>
              {this.state.message || 'An unexpected error occurred.'}
            </p>
            <button className="btn btn--primary" onClick={this.handleReset}>
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
