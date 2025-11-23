import { describe, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import fc from 'fast-check';
import { LoadingSpinner } from './LoadingSpinner';

/**
 * Feature: tax-data-table, Property 13: Loading states display indicators
 * Validates: Requirements 7.3
 * 
 * For any asynchronous operation in progress (fetching taxes, fetching countries, saving changes),
 * an appropriate loading indicator should be visible to the user
 */
describe('LoadingSpinner Property-Based Tests', () => {
  it('Property 13: Loading states display indicators', () => {
    fc.assert(
      fc.property(
        fc.record({
          size: fc.constantFrom('small', 'medium', 'large'),
          message: fc.option(
            fc.array(fc.constantFrom('a', 'b', 'c', ' ', '1', '2', '3'), { minLength: 1, maxLength: 50 })
              .map(arr => arr.join(''))
              .filter(s => s.trim().length > 0),
            { nil: undefined }
          ),
        }),
        ({ size, message }) => {
          const { container, unmount } = render(
            <LoadingSpinner size={size as 'small' | 'medium' | 'large'} message={message} />
          );

          try {
            // Should have a loading spinner container with proper role
            const spinnerContainer = container.querySelector('.loading-spinner-container');
            expect(spinnerContainer).not.toBeNull();
            expect(spinnerContainer?.getAttribute('role')).toBe('status');
            expect(spinnerContainer?.getAttribute('aria-live')).toBe('polite');

            // Should have the actual spinner element
            const spinner = container.querySelector('.spinner');
            expect(spinner).not.toBeNull();

            // Should have screen reader text
            const srText = screen.getByText('Loading...');
            expect(srText).toBeInTheDocument();
            expect(srText.className).toContain('sr-only');

            // If message is provided, it should be displayed
            if (message) {
              // Use a more flexible query that handles whitespace
              const messageElement = container.querySelector('.loading-message');
              expect(messageElement).not.toBeNull();
              expect(messageElement?.textContent).toBe(message);
            }

            // Should have the correct size class
            const loadingSpinner = container.querySelector(`.loading-spinner-${size}`);
            expect(loadingSpinner).not.toBeNull();
          } finally {
            unmount();
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
