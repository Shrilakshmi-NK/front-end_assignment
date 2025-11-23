import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export function LoadingSpinner({ size = 'medium', message }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner-container" role="status" aria-live="polite">
      <div className={`loading-spinner loading-spinner-${size}`} aria-hidden="true">
        <div className="spinner"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
