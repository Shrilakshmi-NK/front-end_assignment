import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { TaxTable } from './TaxTable';
import { TaxRecord } from '../types';

/**
 * Feature: tax-data-table, Property 2: Table contains all required columns
 * Validates: Requirements 1.3
 */
describe('TaxTable Property Tests', () => {
  it('Property 2: Table contains all required columns', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            name: fc.string({ minLength: 1 }),
            country: fc.string({ minLength: 1 }),
          })
        ),
        (taxRecords: TaxRecord[]) => {
          const mockOnEdit = vi.fn();
          const { container } = render(
            <TaxTable data={taxRecords} onEdit={mockOnEdit} isLoading={false} />
          );

          // Check that all required columns are present in the table header
          const headers = container.querySelectorAll('th');
          const headerTexts = Array.from(headers).map((h) => h.textContent);

          // Required columns: ID, Name, Country, Actions
          expect(headerTexts).toContain('ID');
          expect(headerTexts).toContain('Name');
          expect(headerTexts).toContain('Country');
          expect(headerTexts).toContain('Actions');

          // Verify we have exactly 4 columns
          expect(headers.length).toBe(4);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tax-data-table, Property 3: Each table row has an edit icon
   * Validates: Requirements 2.1
   */
  it('Property 3: Each table row has an edit icon', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            name: fc.string({ minLength: 1 }),
            country: fc.string({ minLength: 1 }),
          }),
          { minLength: 1 } // Ensure at least one record
        ),
        (taxRecords: TaxRecord[]) => {
          const mockOnEdit = vi.fn();
          const { container } = render(
            <TaxTable data={taxRecords} onEdit={mockOnEdit} isLoading={false} />
          );

          // Get all table rows in tbody
          const rows = container.querySelectorAll('tbody tr');
          
          // Each row should have an edit button
          expect(rows.length).toBe(taxRecords.length);
          
          rows.forEach((row) => {
            const editButton = row.querySelector('.edit-button');
            expect(editButton).not.toBeNull();
            expect(editButton?.tagName).toBe('BUTTON');
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
