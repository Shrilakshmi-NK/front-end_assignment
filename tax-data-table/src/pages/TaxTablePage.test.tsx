import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaxTablePage } from './TaxTablePage';
import * as taxService from '../services/taxService';
import * as countryService from '../services/countryService';
import { TaxRecord, Country } from '../types';

describe('TaxTablePage Integration Tests', () => {
  const mockTaxData: TaxRecord[] = [
    { id: '1', name: 'Income Tax', country: 'USA' },
    { id: '2', name: 'Sales Tax', country: 'Canada' },
    { id: '3', name: 'VAT', country: 'UK' },
  ];

  const mockCountries: Country[] = [
    { id: '1', name: 'USA' },
    { id: '2', name: 'Canada' },
    { id: '3', name: 'UK' },
    { id: '4', name: 'Germany' },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Default mock implementations
    vi.spyOn(taxService, 'fetchTaxes').mockResolvedValue(mockTaxData);
    vi.spyOn(countryService, 'fetchCountries').mockResolvedValue(mockCountries);
    vi.spyOn(taxService, 'updateTax').mockImplementation(async (id, updates) => {
      const original = mockTaxData.find(t => t.id === id);
      return { ...original, ...updates } as TaxRecord;
    });
  });

  it('complete edit flow: open modal → edit → save → table updates', async () => {
    const user = userEvent.setup();
    
    // Render the page
    render(<TaxTablePage />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Income Tax')).toBeInTheDocument();
    });

    // Verify table displays all records
    expect(screen.getByText('Income Tax')).toBeInTheDocument();
    expect(screen.getByText('Sales Tax')).toBeInTheDocument();
    expect(screen.getByText('VAT')).toBeInTheDocument();

    // Click edit button for first record
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Verify modal displays correct data
    const nameInput = screen.getByLabelText(/tax name/i) as HTMLInputElement;
    expect(nameInput.value).toBe('Income Tax');

    // Edit the name
    await user.clear(nameInput);
    await user.type(nameInput, 'Federal Income Tax');

    // Change country
    const countrySelect = screen.getByLabelText(/country/i) as HTMLSelectElement;
    await user.selectOptions(countrySelect, 'Canada');

    // Mock the updated data that will be returned after save
    const updatedMockData = [
      { id: '1', name: 'Federal Income Tax', country: 'Canada' },
      { id: '2', name: 'Sales Tax', country: 'Canada' },
      { id: '3', name: 'VAT', country: 'UK' },
    ];
    vi.spyOn(taxService, 'fetchTaxes').mockResolvedValue(updatedMockData);

    // Click save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    // Verify updateTax was called with correct data
    await waitFor(() => {
      expect(taxService.updateTax).toHaveBeenCalledWith('1', {
        id: '1',
        name: 'Federal Income Tax',
        country: 'Canada',
      });
    });

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Verify table was refreshed and shows updated data
    await waitFor(() => {
      expect(screen.getByText('Federal Income Tax')).toBeInTheDocument();
    });
  });

  it('complete cancel flow: open modal → edit → cancel → changes discarded', async () => {
    const user = userEvent.setup();
    
    render(<TaxTablePage />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Income Tax')).toBeInTheDocument();
    });

    // Get edit buttons after data loads
    let editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Edit the name
    const nameInput = screen.getByLabelText(/tax name/i) as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'Modified Name');

    // Change country
    const countrySelect = screen.getByLabelText(/country/i) as HTMLSelectElement;
    await user.selectOptions(countrySelect, 'Germany');

    // Click cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify updateTax was NOT called
    expect(taxService.updateTax).not.toHaveBeenCalled();

    // Verify original data is still displayed
    expect(screen.getByText('Income Tax')).toBeInTheDocument();
    expect(screen.queryByText('Modified Name')).not.toBeInTheDocument();

    // Open modal again to verify changes were discarded
    editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    }, { timeout: 3000 });

    const nameInputAgain = screen.getByLabelText(/tax name/i) as HTMLInputElement;
    expect(nameInputAgain.value).toBe('Income Tax');
  });

  it('error recovery flow: handles fetch error with retry', async () => {
    const user = userEvent.setup();
    
    // Mock initial fetch to fail
    vi.spyOn(taxService, 'fetchTaxes').mockRejectedValueOnce({
      message: 'Network error',
      status: 0,
    });

    render(<TaxTablePage />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    // Verify retry button is present
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();

    // Mock successful fetch for retry
    vi.spyOn(taxService, 'fetchTaxes').mockResolvedValue(mockTaxData);

    // Click retry
    await user.click(retryButton);

    // Wait for data to load successfully
    await waitFor(() => {
      expect(screen.getByText('Income Tax')).toBeInTheDocument();
    });

    // Verify error message is gone
    expect(screen.queryByText('Network error')).not.toBeInTheDocument();
  });

  it('error recovery flow: handles save error and keeps modal open', async () => {
    const user = userEvent.setup();
    
    render(<TaxTablePage />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Income Tax')).toBeInTheDocument();
    });

    // Click edit button
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Edit the name
    const nameInput = screen.getByLabelText(/tax name/i) as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Tax');

    // Mock save to fail
    vi.spyOn(taxService, 'updateTax').mockRejectedValueOnce({
      message: 'Failed to save changes',
      status: 500,
    });

    // Click save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    // Wait for error message to appear in modal
    await waitFor(() => {
      expect(screen.getByText('Failed to save changes')).toBeInTheDocument();
    });

    // Verify modal is still open
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    // Verify the edited value is still in the input
    expect(nameInput.value).toBe('Updated Tax');

    // Mock successful save for retry
    vi.spyOn(taxService, 'updateTax').mockResolvedValue({
      id: '1',
      name: 'Updated Tax',
      country: 'USA',
    });
    vi.spyOn(taxService, 'fetchTaxes').mockResolvedValue([
      { id: '1', name: 'Updated Tax', country: 'USA' },
      { id: '2', name: 'Sales Tax', country: 'Canada' },
      { id: '3', name: 'VAT', country: 'UK' },
    ]);

    // Click save again (retry)
    await user.click(saveButton);

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Verify table shows updated data
    await waitFor(() => {
      expect(screen.getByText('Updated Tax')).toBeInTheDocument();
    });
  });

  it('error recovery flow: handles countries fetch error', async () => {
    const user = userEvent.setup();
    
    // Mock countries fetch to fail
    vi.spyOn(countryService, 'fetchCountries').mockRejectedValue({
      message: 'Failed to load countries',
      status: 500,
    });

    render(<TaxTablePage />);

    // Wait for tax data to load
    await waitFor(() => {
      expect(screen.getByText('Income Tax')).toBeInTheDocument();
    });

    // Click edit button
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Verify error message is displayed in modal
    await waitFor(() => {
      expect(screen.getByText('Failed to load countries')).toBeInTheDocument();
    });

    // Verify country dropdown is disabled
    const countrySelect = screen.getByLabelText(/country/i) as HTMLSelectElement;
    expect(countrySelect).toBeDisabled();

    // Verify retry button is present
    const retryButtons = screen.getAllByRole('button', { name: /retry/i });
    expect(retryButtons.length).toBeGreaterThan(0);

    // Mock successful countries fetch for retry
    vi.spyOn(countryService, 'fetchCountries').mockResolvedValue(mockCountries);

    // Click retry button (the one in the modal for countries)
    await user.click(retryButtons[0]);

    // Wait for countries to load
    await waitFor(() => {
      expect(countrySelect).not.toBeDisabled();
    });

    // Verify error message is gone
    await waitFor(() => {
      expect(screen.queryByText('Failed to load countries')).not.toBeInTheDocument();
    });
  });

  it('modal prevents table interaction when open', async () => {
    const user = userEvent.setup();
    
    render(<TaxTablePage />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Income Tax')).toBeInTheDocument();
    });

    // Click edit button for first record
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // The modal itself has the modal-overlay class and role="dialog"
    const modalOverlay = screen.getByRole('dialog');
    expect(modalOverlay).toHaveClass('modal-overlay');

    // Close modal
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Now table should be interactive again
    const editButtonsAfter = screen.getAllByRole('button', { name: /edit/i });
    expect(editButtonsAfter).toHaveLength(3);
  });

  it('close modal by clicking outside', async () => {
    const user = userEvent.setup();
    
    render(<TaxTablePage />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Income Tax')).toBeInTheDocument();
    });

    // Click edit button
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    await user.click(editButtons[0]);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Edit the name
    const nameInput = screen.getByLabelText(/tax name/i) as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'Modified Name');

    // Click on the overlay (the dialog element itself is the overlay)
    const modalOverlay = screen.getByRole('dialog');
    // We need to click directly on the overlay, not on any child elements
    // The handleOverlayClick checks if e.target === e.currentTarget
    await user.click(modalOverlay);

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify changes were discarded (updateTax not called)
    expect(taxService.updateTax).not.toHaveBeenCalled();

    // Verify original data is still displayed
    expect(screen.getByText('Income Tax')).toBeInTheDocument();
  });
});
