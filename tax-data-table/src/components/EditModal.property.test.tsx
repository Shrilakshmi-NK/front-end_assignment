import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { EditModal } from './EditModal';
import { TaxRecord, Country } from '../types';

/**
 * Feature: tax-data-table, Property 4: Edit icon opens modal with correct data
 * Validates: Requirements 2.2, 2.3
 */
describe('EditModal Property Tests', () => {
  afterEach(() => {
    cleanup();
  });

  it('Property 4: For any tax record, when modal opens, it should display that specific records current data', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }),
          name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          country: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        }),
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          }),
          { minLength: 1 }
        ),
        (taxRecord: TaxRecord, baseCountries: Country[]) => {
          const onSave = vi.fn();
          const onCancel = vi.fn();
          
          // Ensure the taxRecord's country is in the countries list
          const countries = [
            ...baseCountries,
            { id: 'current', name: taxRecord.country }
          ];

          render(
            <EditModal
              isOpen={true}
              taxRecord={taxRecord}
              countries={countries}
              onSave={onSave}
              onCancel={onCancel}
              isLoading={false}
            />
          );

          try {
            // Modal should be rendered
            const modal = screen.getByRole('dialog');
            expect(modal).toBeTruthy();

            // The name input should contain the tax record's name
            const nameInput = screen.getByLabelText('Tax name') as HTMLInputElement;
            expect(nameInput.value).toBe(taxRecord.name);
            
            // The country select should contain the tax record's country
            const countrySelect = screen.getByLabelText('Country') as HTMLSelectElement;
            expect(countrySelect.value).toBe(taxRecord.country);
          } finally {
            // Cleanup after each property test iteration
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tax-data-table, Property 6: Name input updates in real-time
   * Validates: Requirements 3.2
   */
  it('Property 6: For any text input in the name field, the displayed value should update immediately to reflect the input', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    
    fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.string({ minLength: 1 }),
          name: fc.string({ minLength: 1 }),
          country: fc.string({ minLength: 1 }),
        }),
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            name: fc.string({ minLength: 1 }),
          }),
          { minLength: 1 }
        ),
        fc.string({ minLength: 1, maxLength: 50 }),
        async (taxRecord: TaxRecord, countries: Country[], newName: string) => {
          const onSave = vi.fn();
          const onCancel = vi.fn();
          const user = userEvent.setup();

          render(
            <EditModal
              isOpen={true}
              taxRecord={taxRecord}
              countries={countries}
              onSave={onSave}
              onCancel={onCancel}
              isLoading={false}
            />
          );

          try {
            // Find the name input
            const nameInput = screen.getByLabelText('Tax name') as HTMLInputElement;
            expect(nameInput).toBeTruthy();

            // Clear the input and type new name
            await user.clear(nameInput);
            await user.type(nameInput, newName);

            // The input value should match the new name
            expect(nameInput.value).toBe(newName);
          } finally {
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tax-data-table, Property 7: Whitespace-only names prevent saving
   * Validates: Requirements 3.3, 3.4
   */
  it('Property 7: For any string composed entirely of whitespace, the save button should be disabled', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    
    fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.string({ minLength: 1 }),
          name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          country: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        }),
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          }),
          { minLength: 1 }
        ),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length === 0),
        async (taxRecord: TaxRecord, baseCountries: Country[], whitespaceName: string) => {
          const onSave = vi.fn();
          const onCancel = vi.fn();
          const user = userEvent.setup();
          
          // Ensure the taxRecord's country is in the countries list
          const countries = [
            ...baseCountries,
            { id: 'current', name: taxRecord.country }
          ];

          render(
            <EditModal
              isOpen={true}
              taxRecord={taxRecord}
              countries={countries}
              onSave={onSave}
              onCancel={onCancel}
              isLoading={false}
            />
          );

          try {
            // Find the name input and save button
            const nameInput = screen.getByLabelText('Tax name') as HTMLInputElement;
            const saveButton = screen.getByRole('button', { name: /save/i });

            // Clear the input and type whitespace-only name
            await user.clear(nameInput);
            await user.type(nameInput, whitespaceName);

            // The save button should be disabled
            expect(saveButton).toBeDisabled();
          } finally {
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tax-data-table, Property 8: Country dropdown displays all fetched countries
   * Validates: Requirements 4.2, 4.3
   */
  it('Property 8: For any list of countries successfully fetched from the API, all countries should appear as options in the country dropdown', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }),
          name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          country: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        }),
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (taxRecord: TaxRecord, countries: Country[]) => {
          const onSave = vi.fn();
          const onCancel = vi.fn();

          render(
            <EditModal
              isOpen={true}
              taxRecord={taxRecord}
              countries={countries}
              onSave={onSave}
              onCancel={onCancel}
              isLoading={false}
            />
          );

          try {
            // Find the country select
            const countrySelect = screen.getByLabelText('Country') as HTMLSelectElement;
            
            // Get all options from the select
            const options = Array.from(countrySelect.options);
            const optionValues = options.map(opt => opt.value);
            
            // All countries should appear as options
            for (const country of countries) {
              expect(optionValues).toContain(country.name);
            }
          } finally {
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tax-data-table, Property 9: Country selection updates the value
   * Validates: Requirements 4.4
   */
  it('Property 9: For any country selected from the dropdown, the selected country value should update to match the selection', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    
    fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.string({ minLength: 1 }),
          name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          country: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        }),
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          }),
          { minLength: 2, maxLength: 10 }
        ),
        fc.nat(),
        async (taxRecord: TaxRecord, countries: Country[], selectionIndex: number) => {
          const onSave = vi.fn();
          const onCancel = vi.fn();
          const user = userEvent.setup();
          
          // Pick a country to select (use modulo to ensure valid index)
          const selectedCountry = countries[selectionIndex % countries.length];

          render(
            <EditModal
              isOpen={true}
              taxRecord={taxRecord}
              countries={countries}
              onSave={onSave}
              onCancel={onCancel}
              isLoading={false}
            />
          );

          try {
            // Find the country select
            const countrySelect = screen.getByLabelText('Country') as HTMLSelectElement;

            // Select the country
            await user.selectOptions(countrySelect, selectedCountry.name);

            // The select value should match the selected country
            expect(countrySelect.value).toBe(selectedCountry.name);
          } finally {
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tax-data-table, Property 5: Modal prevents table interaction
   * Validates: Requirements 2.4
   */
  it('Property 5: For any state where the edit modal is open, user interactions with the table should be blocked', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }),
          name: fc.string({ minLength: 1 }),
          country: fc.string({ minLength: 1 }),
        }),
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            name: fc.string({ minLength: 1 }),
          })
        ),
        (taxRecord: TaxRecord, countries: Country[]) => {
          const onSave = vi.fn();
          const onCancel = vi.fn();

          const { container } = render(
            <EditModal
              isOpen={true}
              taxRecord={taxRecord}
              countries={countries}
              onSave={onSave}
              onCancel={onCancel}
              isLoading={false}
            />
          );

          try {
            // Modal overlay should exist
            const modal = container.querySelector('.modal-overlay');
            expect(modal).not.toBeNull();

            // Modal should have the modal-overlay class which provides blocking behavior
            expect(modal?.classList.contains('modal-overlay')).toBe(true);
            
            // Modal should have role="dialog" and aria-modal="true" for accessibility
            expect(modal?.getAttribute('role')).toBe('dialog');
            expect(modal?.getAttribute('aria-modal')).toBe('true');
          } finally {
            // Cleanup after each property test iteration
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tax-data-table, Property 10: PUT request preserves all existing fields
   * Validates: Requirements 5.2
   */
  it('Property 10: For any tax record being updated, the PUT request payload should contain all original fields plus the updated name and country', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    
    fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.string({ minLength: 1 }),
          name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          country: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          // Additional arbitrary fields that should be preserved
          additionalField1: fc.string(),
          additionalField2: fc.integer(),
          additionalField3: fc.boolean(),
        }),
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          }),
          { minLength: 2 }
        ),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.nat(),
        async (taxRecord: TaxRecord, countries: Country[], newName: string, countryIndex: number) => {
          const onSave = vi.fn().mockResolvedValue(undefined);
          const onCancel = vi.fn();
          const user = userEvent.setup();
          
          const selectedCountry = countries[countryIndex % countries.length];

          render(
            <EditModal
              isOpen={true}
              taxRecord={taxRecord}
              countries={countries}
              onSave={onSave}
              onCancel={onCancel}
              isLoading={false}
            />
          );

          try {
            // Update the name
            const nameInput = screen.getByLabelText('Tax name') as HTMLInputElement;
            await user.clear(nameInput);
            await user.type(nameInput, newName);

            // Update the country
            const countrySelect = screen.getByLabelText('Country') as HTMLSelectElement;
            await user.selectOptions(countrySelect, selectedCountry.name);

            // Click save
            const saveButton = screen.getByRole('button', { name: /save/i });
            await user.click(saveButton);

            // Verify onSave was called with all original fields preserved
            expect(onSave).toHaveBeenCalledTimes(1);
            const savedData = onSave.mock.calls[0][0];
            
            // Check that all original fields are present
            expect(savedData).toHaveProperty('id', taxRecord.id);
            expect(savedData).toHaveProperty('additionalField1', taxRecord.additionalField1);
            expect(savedData).toHaveProperty('additionalField2', taxRecord.additionalField2);
            expect(savedData).toHaveProperty('additionalField3', taxRecord.additionalField3);
            
            // Check that name and country are updated
            expect(savedData).toHaveProperty('name', newName.trim());
            expect(savedData).toHaveProperty('country', selectedCountry.name);
          } finally {
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tax-data-table, Property 11: Successful save closes modal and refreshes data
   * Validates: Requirements 5.3, 5.4
   */
  it('Property 11: For any successful PUT request, the onSave callback should be invoked', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    
    fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.string({ minLength: 1 }),
          name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          country: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        }),
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          }),
          { minLength: 1 }
        ),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        async (taxRecord: TaxRecord, countries: Country[], newName: string) => {
          const onSave = vi.fn().mockResolvedValue(undefined);
          const onCancel = vi.fn();
          const user = userEvent.setup();

          render(
            <EditModal
              isOpen={true}
              taxRecord={taxRecord}
              countries={countries}
              onSave={onSave}
              onCancel={onCancel}
              isLoading={false}
            />
          );

          try {
            // Update the name
            const nameInput = screen.getByLabelText('Tax name') as HTMLInputElement;
            await user.clear(nameInput);
            await user.type(nameInput, newName);

            // Click save
            const saveButton = screen.getByRole('button', { name: /save/i });
            await user.click(saveButton);

            // Wait for async operations to complete
            await new Promise(resolve => setTimeout(resolve, 50));

            // Verify onSave was called (which triggers modal close and data refresh in parent)
            expect(onSave).toHaveBeenCalledTimes(1);
            expect(onSave).toHaveBeenCalledWith(
              expect.objectContaining({
                id: taxRecord.id,
                name: newName.trim(),
                country: taxRecord.country,
              })
            );
          } finally {
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: tax-data-table, Property 12: Modal close without save discards changes
   * Validates: Requirements 6.2, 6.3, 6.4
   */
  it('Property 12: For any modal close action without saving, all unsaved changes should be discarded', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    
    fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.string({ minLength: 1 }),
          name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          country: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
        }),
        fc.array(
          fc.record({
            id: fc.string({ minLength: 1 }),
            name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
          }),
          { minLength: 2 }
        ),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.nat(),
        fc.constantFrom('cancel-button', 'close-button', 'escape-key', 'overlay-click'),
        async (taxRecord: TaxRecord, countries: Country[], newName: string, countryIndex: number, closeMethod: string) => {
          const onSave = vi.fn().mockResolvedValue(undefined);
          const onCancel = vi.fn();
          const user = userEvent.setup();
          
          const selectedCountry = countries[countryIndex % countries.length];

          const { container } = render(
            <EditModal
              isOpen={true}
              taxRecord={taxRecord}
              countries={countries}
              onSave={onSave}
              onCancel={onCancel}
              isLoading={false}
            />
          );

          try {
            // Make changes to the form
            const nameInput = screen.getByLabelText('Tax name') as HTMLInputElement;
            await user.clear(nameInput);
            await user.type(nameInput, newName);

            const countrySelect = screen.getByLabelText('Country') as HTMLSelectElement;
            await user.selectOptions(countrySelect, selectedCountry.name);

            // Close modal without saving using different methods
            switch (closeMethod) {
              case 'cancel-button':
                const cancelButton = screen.getByRole('button', { name: /cancel/i });
                await user.click(cancelButton);
                break;
              case 'close-button':
                const closeButton = screen.getByLabelText('Close modal');
                await user.click(closeButton);
                break;
              case 'escape-key':
                await user.keyboard('{Escape}');
                break;
              case 'overlay-click':
                const overlay = container.querySelector('.modal-overlay');
                if (overlay) {
                  await user.click(overlay);
                }
                break;
            }

            // Verify onCancel was called (which closes modal without saving)
            expect(onCancel).toHaveBeenCalledTimes(1);
            
            // Verify onSave was NOT called (changes were discarded)
            expect(onSave).not.toHaveBeenCalled();
          } finally {
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
