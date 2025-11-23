import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import { useTaxData } from './useTaxData';
import * as taxService from '../services/taxService';
import { TaxRecord } from '../types';

// Feature: tax-data-table, Property 1: Table displays all fetched records
// Validates: Requirements 1.2

describe('useTaxData - Property-Based Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Property 1: For any set of tax records successfully fetched from the API, all records should appear in the data', async () => {
    // Generator for valid tax records
    const taxRecordArbitrary = fc.record({
      id: fc.string({ minLength: 1 }),
      name: fc.string({ minLength: 1 }),
      country: fc.string({ minLength: 1 }),
    }) as fc.Arbitrary<TaxRecord>;

    // Generator for arrays of tax records
    const taxRecordsArrayArbitrary = fc.array(taxRecordArbitrary, { minLength: 0, maxLength: 20 });

    await fc.assert(
      fc.asyncProperty(taxRecordsArrayArbitrary, async (generatedRecords) => {
        // Mock the fetchTaxes function to return our generated records
        vi.spyOn(taxService, 'fetchTaxes').mockResolvedValue(generatedRecords);

        // Render the hook
        const { result, unmount } = renderHook(() => useTaxData());

        // Wait for the hook to finish loading
        await waitFor(
          () => {
            expect(result.current.isLoading).toBe(false);
          },
          { timeout: 1000 }
        );

        // Property: All fetched records should appear in the data
        expect(result.current.data).toHaveLength(generatedRecords.length);
        
        // Verify each generated record appears in the data
        generatedRecords.forEach((record) => {
          const foundRecord = result.current.data.find((r) => r.id === record.id);
          expect(foundRecord).toBeDefined();
          expect(foundRecord?.name).toBe(record.name);
          expect(foundRecord?.country).toBe(record.country);
        });

        // Verify no error occurred
        expect(result.current.error).toBeNull();

        // Cleanup
        unmount();
        vi.clearAllMocks();
      }),
      { numRuns: 100 }
    );
  }, 30000);
});
