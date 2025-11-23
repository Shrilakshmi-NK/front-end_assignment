import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useTaxData } from './useTaxData';
import * as taxService from '../services/taxService';
import { TaxRecord, ApiError } from '../types';

describe('useTaxData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch tax data successfully', async () => {
    const mockData: TaxRecord[] = [
      { id: '1', name: 'Tax A', country: 'USA' },
      { id: '2', name: 'Tax B', country: 'Canada' },
    ];

    vi.spyOn(taxService, 'fetchTaxes').mockResolvedValue(mockData);

    const { result } = renderHook(() => useTaxData());

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    const mockError: ApiError = {
      message: 'Network error',
      status: 500,
    };

    vi.spyOn(taxService, 'fetchTaxes').mockRejectedValue(mockError);

    const { result } = renderHook(() => useTaxData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toEqual(mockError);
  });

  it('should refetch data when refetch is called', async () => {
    const initialData: TaxRecord[] = [{ id: '1', name: 'Tax A', country: 'USA' }];
    const updatedData: TaxRecord[] = [
      { id: '1', name: 'Tax A', country: 'USA' },
      { id: '2', name: 'Tax B', country: 'Canada' },
    ];

    const fetchSpy = vi
      .spyOn(taxService, 'fetchTaxes')
      .mockResolvedValueOnce(initialData)
      .mockResolvedValueOnce(updatedData);

    const { result } = renderHook(() => useTaxData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(initialData);

    // Refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.data).toEqual(updatedData);
    });

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('should update a record and refetch data', async () => {
    const initialData: TaxRecord[] = [{ id: '1', name: 'Tax A', country: 'USA' }];
    const updatedData: TaxRecord[] = [{ id: '1', name: 'Tax A Updated', country: 'Canada' }];

    vi.spyOn(taxService, 'fetchTaxes')
      .mockResolvedValueOnce(initialData)
      .mockResolvedValueOnce(updatedData);

    vi.spyOn(taxService, 'updateTax').mockResolvedValue(updatedData[0]);

    const { result } = renderHook(() => useTaxData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(initialData);

    // Update record
    await result.current.updateRecord('1', { name: 'Tax A Updated', country: 'Canada' });

    await waitFor(() => {
      expect(result.current.data).toEqual(updatedData);
    });
  });

  it('should throw error when update fails', async () => {
    const mockData: TaxRecord[] = [{ id: '1', name: 'Tax A', country: 'USA' }];
    const mockError: ApiError = {
      message: 'Update failed',
      status: 500,
    };

    vi.spyOn(taxService, 'fetchTaxes').mockResolvedValue(mockData);
    vi.spyOn(taxService, 'updateTax').mockRejectedValue(mockError);

    const { result } = renderHook(() => useTaxData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await expect(result.current.updateRecord('1', { name: 'Updated' })).rejects.toEqual(mockError);
  });
});
