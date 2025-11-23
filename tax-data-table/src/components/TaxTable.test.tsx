import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaxTable } from './TaxTable';
import { TaxRecord } from '../types';

describe('TaxTable Unit Tests', () => {
  it('renders table with empty data', () => {
    const mockOnEdit = vi.fn();
    render(<TaxTable data={[]} onEdit={mockOnEdit} isLoading={false} />);

    // Should show empty state message
    expect(screen.getByText('No tax records found')).toBeInTheDocument();
    
    // Should still render table headers
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('renders table with multiple records', () => {
    const mockOnEdit = vi.fn();
    const testData: TaxRecord[] = [
      { id: '1', name: 'Tax A', country: 'USA' },
      { id: '2', name: 'Tax B', country: 'Canada' },
      { id: '3', name: 'Tax C', country: 'UK' },
    ];

    render(<TaxTable data={testData} onEdit={mockOnEdit} isLoading={false} />);

    // Should render all records
    expect(screen.getByText('Tax A')).toBeInTheDocument();
    expect(screen.getByText('Tax B')).toBeInTheDocument();
    expect(screen.getByText('Tax C')).toBeInTheDocument();
    expect(screen.getByText('USA')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('UK')).toBeInTheDocument();

    // Should not show empty state
    expect(screen.queryByText('No tax records found')).not.toBeInTheDocument();
  });

  it('edit icon click triggers callback', async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn();
    const testData: TaxRecord[] = [
      { id: '1', name: 'Tax A', country: 'USA' },
      { id: '2', name: 'Tax B', country: 'Canada' },
    ];

    render(<TaxTable data={testData} onEdit={mockOnEdit} isLoading={false} />);

    // Find and click the first edit button
    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    expect(editButtons).toHaveLength(2);

    await user.click(editButtons[0]);

    // Should call onEdit with the correct record
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(testData[0]);
  });

  it('displays loading state', () => {
    const mockOnEdit = vi.fn();
    render(<TaxTable data={[]} onEdit={mockOnEdit} isLoading={true} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('displays loading spinner with message during data fetch', () => {
    const mockOnEdit = vi.fn();
    render(<TaxTable data={[]} onEdit={mockOnEdit} isLoading={true} />);

    // Should show loading spinner
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Loading tax records...')).toBeInTheDocument();

    // Should not show table when loading
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('hides loading spinner when data is loaded', () => {
    const mockOnEdit = vi.fn();
    const testData: TaxRecord[] = [
      { id: '1', name: 'Tax A', country: 'USA' },
    ];

    render(<TaxTable data={testData} onEdit={mockOnEdit} isLoading={false} />);

    // Should not show loading spinner
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading tax records...')).not.toBeInTheDocument();

    // Should show table
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('displays error message when fetch fails', () => {
    const mockOnEdit = vi.fn();
    const error = { message: 'Failed to fetch tax records', status: 500 };

    render(
      <TaxTable 
        data={[]} 
        onEdit={mockOnEdit} 
        isLoading={false} 
        error={error}
      />
    );

    // Should show error message
    expect(screen.getByText('Failed to fetch tax records')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Should not show table
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('displays retry button when error occurs', () => {
    const mockOnEdit = vi.fn();
    const mockOnRetry = vi.fn();
    const error = { message: 'Network error', status: 0 };

    render(
      <TaxTable 
        data={[]} 
        onEdit={mockOnEdit} 
        isLoading={false} 
        error={error}
        onRetry={mockOnRetry}
      />
    );

    // Should show retry button
    const retryButton = screen.getByRole('button', { name: /retry/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn();
    const mockOnRetry = vi.fn();
    const error = { message: 'Network error', status: 0 };

    render(
      <TaxTable 
        data={[]} 
        onEdit={mockOnEdit} 
        isLoading={false} 
        error={error}
        onRetry={mockOnRetry}
      />
    );

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });
});
