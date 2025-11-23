import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import { renderHook } from '@testing-library/react';
import { useTaxData } from '../hooks/useTaxData';
import { useCountries } from '../hooks/useCountries';
import * as taxService from '../services/taxService';
import * as countryService from '../services/countryService';
import { ApiError } from '../types';

/**
 * Feature: tax-data-table, Property 14: API errors display error messages
 * Validates: Requirements 1.5, 4.5, 5.5, 7.5, 8.3
 */
describe('Error Handling Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  /**
   * Property 14a: For any API error when fetching taxes, an error message should be set
   */
  it('Property 14a: For any taxes fetch failure, the error state should contain an appropriate error message', async () => {
    // Generator for API errors
    const apiErrorArbitrary = fc.record({
      message: fc.string({ minLength: 1, maxLength: 100 }),
      status: fc.integer({ min: 400, max: 599 }),
    }) as fc.Arbitrary<ApiError>;

    await fc.assert(
      fc.asyncProperty(apiErrorArbitrary, async (generatedError) => {
        // Mock the fetchTaxes function to reject with our generated error
        vi.spyOn(taxService, 'fetchTaxes').mockRejectedValue(generatedError);

        // Render the hook
        const { result, unmount } = renderHook(() => useTaxData());

        // Wait for the hook to finish loading
        await waitFor(
          () => {
            expect(result.current.isLoading).toBe(false);
          },
          { timeout: 1000 }
        );

        // Property: Error should be set with the appropriate message
        expect(result.current.error).not.toBeNull();
        expect(result.current.error?.message).toBeTruthy();
        expect(typeof result.current.error?.message).toBe('string');
        expect(result.current.error?.message.length).toBeGreaterThan(0);

        // Cleanup
        unmount();
        vi.clearAllMocks();
      }),
      { numRuns: 100 }
    );
  }, 30000);

  /**
   * Property 14b: For any API error when fetching countries, an error message should be set
   */
  it('Property 14b: For any countries fetch failure, the error state should contain an appropriate error message', async () => {
    // Generator for API errors
    const apiErrorArbitrary = fc.record({
      message: fc.string({ minLength: 1, maxLength: 100 }),
      status: fc.integer({ min: 400, max: 599 }),
    }) as fc.Arbitrary<ApiError>;

    await fc.assert(
      fc.asyncProperty(apiErrorArbitrary, async (generatedError) => {
        // Mock the fetchCountries function to reject with our generated error
        vi.spyOn(countryService, 'fetchCountries').mockRejectedValue(generatedError);

        // Render the hook
        const { result, unmount } = renderHook(() => useCountries());

        // Wait for the hook to finish loading
        await waitFor(
          () => {
            expect(result.current.isLoading).toBe(false);
          },
          { timeout: 1000 }
        );

        // Property: Error should be set with the appropriate message
        expect(result.current.error).not.toBeNull();
        expect(result.current.error?.message).toBeTruthy();
        expect(typeof result.current.error?.message).toBe('string');
        expect(result.current.error?.message.length).toBeGreaterThan(0);

        // Cleanup
        unmount();
        vi.clearAllMocks();
      }),
      { numRuns: 100 }
    );
  }, 30000);

  /**
   * Property 14c: For any API error when updating a tax record, an error should be thrown
   */
  it('Property 14c: For any PUT request failure, the updateRecord function should throw an error with an appropriate message', async () => {
    // Generator for API errors
    const apiErrorArbitrary = fc.record({
      message: fc.string({ minLength: 1, maxLength: 100 }),
      status: fc.integer({ min: 400, max: 599 }),
    }) as fc.Arbitrary<ApiError>;

    const taxRecordArbitrary = fc.record({
      id: fc.string({ minLength: 1 }),
      name: fc.string({ minLength: 1 }),
      country: fc.string({ minLength: 1 }),
    });

    await fc.assert(
      fc.asyncProperty(
        apiErrorArbitrary,
        taxRecordArbitrary,
        fc.string({ minLength: 1 }),
        async (generatedError, taxRecord, newName) => {
          // Mock fetchTaxes to succeed initially
          vi.spyOn(taxService, 'fetchTaxes').mockResolvedValue([taxRecord]);
          
          // Mock updateTax to reject with our generated error
          vi.spyOn(taxService, 'updateTax').mockRejectedValue(generatedError);

          // Render the hook
          const { result, unmount } = renderHook(() => useTaxData());

          // Wait for initial data load
          await waitFor(
            () => {
              expect(result.current.isLoading).toBe(false);
            },
            { timeout: 1000 }
          );

          // Try to update a record
          let caughtError: ApiError | null = null;
          try {
            await result.current.updateRecord(taxRecord.id, { name: newName });
          } catch (error) {
            caughtError = error as ApiError;
          }

          // Property: An error should be thrown with an appropriate message
          expect(caughtError).not.toBeNull();
          expect(caughtError?.message).toBeTruthy();
          expect(typeof caughtError?.message).toBe('string');
          expect(caughtError?.message.length).toBeGreaterThan(0);

          // Cleanup
          unmount();
          vi.clearAllMocks();
        }
      ),
      { numRuns: 100 }
    );
  }, 30000);

  /**
   * Property 14d: For any network error (status 0), an error message should be set
   */
  it('Property 14d: For any network error when fetching taxes, the error state should contain a network error message', async () => {
    // Generator for network errors (status 0)
    const networkErrorArbitrary = fc.record({
      message: fc.constantFrom(
        'Network error',
        'Failed to fetch',
        'Request timeout',
        'Connection refused'
      ),
      status: fc.constant(0),
    }) as fc.Arbitrary<ApiError>;

    await fc.assert(
      fc.asyncProperty(networkErrorArbitrary, async (generatedError) => {
        // Mock the fetchTaxes function to reject with our generated network error
        vi.spyOn(taxService, 'fetchTaxes').mockRejectedValue(generatedError);

        // Render the hook
        const { result, unmount } = renderHook(() => useTaxData());

        // Wait for the hook to finish loading
        await waitFor(
          () => {
            expect(result.current.isLoading).toBe(false);
          },
          { timeout: 1000 }
        );

        // Property: Error should be set with the appropriate message
        expect(result.current.error).not.toBeNull();
        expect(result.current.error?.message).toBeTruthy();
        expect(typeof result.current.error?.message).toBe('string');
        expect(result.current.error?.message.length).toBeGreaterThan(0);
        expect(result.current.error?.status).toBe(0);

        // Cleanup
        unmount();
        vi.clearAllMocks();
      }),
      { numRuns: 100 }
    );
  }, 30000);

  /**
   * Property 14e: For any HTTP error status (4xx, 5xx), an error message should be set
   */
  it('Property 14e: For any HTTP error status when fetching countries, the error state should contain an appropriate error message', async () => {
    // Generator for HTTP errors
    const httpErrorArbitrary = fc.record({
      message: fc.string({ minLength: 1, maxLength: 100 }),
      status: fc.oneof(
        fc.integer({ min: 400, max: 499 }), // Client errors
        fc.integer({ min: 500, max: 599 })  // Server errors
      ),
    }) as fc.Arbitrary<ApiError>;

    await fc.assert(
      fc.asyncProperty(httpErrorArbitrary, async (generatedError) => {
        // Mock the fetchCountries function to reject with our generated HTTP error
        vi.spyOn(countryService, 'fetchCountries').mockRejectedValue(generatedError);

        // Render the hook
        const { result, unmount } = renderHook(() => useCountries());

        // Wait for the hook to finish loading
        await waitFor(
          () => {
            expect(result.current.isLoading).toBe(false);
          },
          { timeout: 1000 }
        );

        // Property: Error should be set with the appropriate message
        expect(result.current.error).not.toBeNull();
        expect(result.current.error?.message).toBeTruthy();
        expect(typeof result.current.error?.message).toBe('string');
        expect(result.current.error?.message.length).toBeGreaterThan(0);
        expect(result.current.error?.status).toBeGreaterThanOrEqual(400);
        expect(result.current.error?.status).toBeLessThan(600);

        // Cleanup
        unmount();
        vi.clearAllMocks();
      }),
      { numRuns: 100 }
    );
  }, 30000);
});
