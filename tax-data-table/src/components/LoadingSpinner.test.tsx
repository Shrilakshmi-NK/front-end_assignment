import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner Unit Tests', () => {
  it('renders loading spinner with default props', () => {
    const { container } = render(<LoadingSpinner />);

    // Should have a loading spinner container
    const spinnerContainer = container.querySelector('.loading-spinner-container');
    expect(spinnerContainer).not.toBeNull();

    // Should have screen reader text
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders loading spinner with message', () => {
    render(<LoadingSpinner message="Loading data..." />);

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders loading spinner with different sizes', () => {
    const { container: smallContainer } = render(<LoadingSpinner size="small" />);
    expect(smallContainer.querySelector('.loading-spinner-small')).not.toBeNull();

    const { container: mediumContainer } = render(<LoadingSpinner size="medium" />);
    expect(mediumContainer.querySelector('.loading-spinner-medium')).not.toBeNull();

    const { container: largeContainer } = render(<LoadingSpinner size="large" />);
    expect(largeContainer.querySelector('.loading-spinner-large')).not.toBeNull();
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(<LoadingSpinner />);

    const spinnerContainer = container.querySelector('.loading-spinner-container');
    expect(spinnerContainer?.getAttribute('role')).toBe('status');
    expect(spinnerContainer?.getAttribute('aria-live')).toBe('polite');
  });
});
