import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="error-message-container" role="alert" aria-live="assertive" aria-atomic="true">
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <div className="error-content">
        <p className="error-text">{message}</p>
        {onRetry && (
          <button 
            className="retry-button" 
            onClick={onRetry}
            aria-label="Retry the failed operation"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
