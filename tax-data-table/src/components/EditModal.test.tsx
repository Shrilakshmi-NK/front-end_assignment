import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditModal } from './EditModal';
import { TaxRecord, Country } from '../types';

describe('EditModal Unit Tests', () => {
  const mockTaxRecord: TaxRecord = {
    id: '1',
    name: 'Test Tax',
    country: 'USA',
  };

  const mockCountries: Country[] = [
    { id: '1', name: 'USA' },
    { id: '2', name: 'Canada' },
  ];

  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  it('should render modal when open', () => {
    const { container } = render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const modal = container.querySelector('.modal-overlay');
    expect(modal).not.toBeNull();
    expect(screen.getByText('Edit Tax Record')).toBeTruthy();
  });

  it('should not render modal when closed', () => {
    const { container } = render(
      <EditModal
        isOpen={false}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const modal = container.querySelector('.modal-overlay');
    expect(modal).toBeNull();
  });

  it('should call onCancel when clicking outside modal', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const overlay = container.querySelector('.modal-overlay');
    expect(overlay).not.toBeNull();

    if (overlay) {
      await user.click(overlay);
      expect(mockOnCancel).toHaveBeenCalled();
    }
  });

  it('should call onCancel when pressing escape key', async () => {
    const user = userEvent.setup();
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    await user.keyboard('{Escape}');
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should call onCancel when clicking close button', async () => {
    const user = userEvent.setup();
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should update name input value when user types', async () => {
    const user = userEvent.setup();
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const nameInput = screen.getByLabelText('Tax name') as HTMLInputElement;
    expect(nameInput.value).toBe('Test Tax');

    await user.clear(nameInput);
    await user.type(nameInput, 'New Tax Name');

    expect(nameInput.value).toBe('New Tax Name');
  });

  it('should populate country dropdown with provided countries', () => {
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const countrySelect = screen.getByLabelText('Country') as HTMLSelectElement;
    const options = Array.from(countrySelect.options);

    expect(options).toHaveLength(2);
    expect(options[0].value).toBe('USA');
    expect(options[1].value).toBe('Canada');
  });

  it('should disable save button when name is empty', async () => {
    const user = userEvent.setup();
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const nameInput = screen.getByLabelText('Tax name') as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: /save/i });

    // Initially save button should be enabled
    expect(saveButton).not.toBeDisabled();

    // Clear the name input
    await user.clear(nameInput);

    // Save button should now be disabled
    expect(saveButton).toBeDisabled();
  });

  it('should disable save button when name contains only whitespace', async () => {
    const user = userEvent.setup();
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const nameInput = screen.getByLabelText('Tax name') as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: /save/i });

    // Clear and type whitespace
    await user.clear(nameInput);
    await user.type(nameInput, '   ');

    // Save button should be disabled
    expect(saveButton).toBeDisabled();
  });

  it('should update country selection when user selects a different country', async () => {
    const user = userEvent.setup();
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const countrySelect = screen.getByLabelText('Country') as HTMLSelectElement;
    expect(countrySelect.value).toBe('USA');

    await user.selectOptions(countrySelect, 'Canada');

    expect(countrySelect.value).toBe('Canada');
  });

  it('should display current tax record values when modal opens', () => {
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const nameInput = screen.getByLabelText('Tax name') as HTMLInputElement;
    const countrySelect = screen.getByLabelText('Country') as HTMLSelectElement;

    expect(nameInput.value).toBe('Test Tax');
    expect(countrySelect.value).toBe('USA');
  });

  it('should disable form inputs when loading', () => {
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    const nameInput = screen.getByLabelText('Tax name') as HTMLInputElement;
    const countrySelect = screen.getByLabelText('Country') as HTMLSelectElement;
    const saveButton = screen.getByRole('button', { name: /saving/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    expect(nameInput).toBeDisabled();
    expect(countrySelect).toBeDisabled();
    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('should call onSave when save button is clicked with valid data', async () => {
    const user = userEvent.setup();
    const mockOnSaveAsync = vi.fn().mockResolvedValue(undefined);
    
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSaveAsync}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const nameInput = screen.getByLabelText('Tax name') as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Tax Name');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    expect(mockOnSaveAsync).toHaveBeenCalledTimes(1);
    expect(mockOnSaveAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        name: 'Updated Tax Name',
        country: 'USA',
      })
    );
  });

  it('should call onSave when save button is clicked even if it fails', async () => {
    const user = userEvent.setup();
    const mockOnSaveError = vi.fn().mockRejectedValue(new Error('Save failed'));
    const localMockOnCancel = vi.fn();
    
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSaveError}
        onCancel={localMockOnCancel}
        isLoading={false}
      />
    );

    const nameInput = screen.getByLabelText('Tax name') as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Tax Name');

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    // onSave should be called (error handling is done by parent component)
    expect(mockOnSaveError).toHaveBeenCalledTimes(1);
  });

  it('should not call onSave when cancel button is clicked', async () => {
    const user = userEvent.setup();
    const localMockOnSave = vi.fn();
    const localMockOnCancel = vi.fn();
    
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={localMockOnSave}
        onCancel={localMockOnCancel}
        isLoading={false}
      />
    );

    const nameInput = screen.getByLabelText('Tax name') as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Tax Name');

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    // onCancel should be called, but onSave should not
    expect(localMockOnCancel).toHaveBeenCalledTimes(1);
    expect(localMockOnSave).not.toHaveBeenCalled();
  });

  it('should display "Saving..." text on save button when loading', () => {
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    const saveButton = screen.getByRole('button', { name: /saving/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should disable close button when loading', () => {
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    const closeButton = screen.getByLabelText('Close modal');
    expect(closeButton).toBeDisabled();
  });

  it('should display error message when save fails', async () => {
    const user = userEvent.setup();
    const mockOnSaveError = vi.fn().mockRejectedValue({
      message: 'Failed to save tax record',
      status: 500,
    });
    
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSaveError}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    // Should display error message
    expect(await screen.findByText('Failed to save tax record')).toBeInTheDocument();
  });

  it('should display error message when countries fetch fails', () => {
    const countriesError = { message: 'Failed to fetch countries', status: 500 };
    
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={[]}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={false}
        countriesError={countriesError}
      />
    );

    // Should display error message
    expect(screen.getByText('Failed to fetch countries')).toBeInTheDocument();
  });

  it('should disable country dropdown when countries fetch fails', () => {
    const countriesError = { message: 'Failed to fetch countries', status: 500 };
    
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={[]}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={false}
        countriesError={countriesError}
      />
    );

    const countrySelect = screen.getByLabelText('Country') as HTMLSelectElement;
    expect(countrySelect).toBeDisabled();
  });

  it('should call onCountriesRetry when retry button is clicked for countries error', async () => {
    const user = userEvent.setup();
    const mockOnCountriesRetry = vi.fn();
    const countriesError = { message: 'Failed to fetch countries', status: 500 };
    
    render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={[]}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        isLoading={false}
        countriesError={countriesError}
        onCountriesRetry={mockOnCountriesRetry}
      />
    );

    const retryButtons = screen.getAllByRole('button', { name: /retry/i });
    await user.click(retryButtons[0]);

    expect(mockOnCountriesRetry).toHaveBeenCalledTimes(1);
  });

  it('should keep modal open when save fails', async () => {
    const user = userEvent.setup();
    const mockOnSaveError = vi.fn().mockRejectedValue({
      message: 'Failed to save tax record',
      status: 500,
    });
    
    const { container } = render(
      <EditModal
        isOpen={true}
        taxRecord={mockTaxRecord}
        countries={mockCountries}
        onSave={mockOnSaveError}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    // Wait for error to appear
    await screen.findByText('Failed to save tax record');

    // Modal should still be open
    const modal = container.querySelector('.modal-overlay');
    expect(modal).not.toBeNull();
  });
});
