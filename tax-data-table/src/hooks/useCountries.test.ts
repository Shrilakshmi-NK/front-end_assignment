import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCountries } from './useCountries';
import * as countryService from '../services/countryService';
import { Country, ApiError } from '../types';

describe('useCountries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch countries successfully', async () => {
    const mockCountries: Country[] = [
      { id: '1', name: 'USA' },
      { id: '2', name: 'Canada' },
      { id: '3', name: 'Mexico' },
    ];

    vi.spyOn(countryService, 'fetchCountries').mockResolvedValue(mockCountries);

    const { result } = renderHook(() => useCountries());

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBeNull();

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.countries).toEqual(mockCountries);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    const mockError: ApiError = {
      message: 'Failed to fetch countries',
      status: 500,
    };

    vi.spyOn(countryService, 'fetchCountries').mockRejectedValue(mockError);

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toEqual(mockError);
  });

  it('should refetch countries when refetch is called', async () => {
    const initialCountries: Country[] = [{ id: '1', name: 'USA' }];
    const updatedCountries: Country[] = [
      { id: '1', name: 'USA' },
      { id: '2', name: 'Canada' },
    ];

    const fetchSpy = vi
      .spyOn(countryService, 'fetchCountries')
      .mockResolvedValueOnce(initialCountries)
      .mockResolvedValueOnce(updatedCountries);

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.countries).toEqual(initialCountries);

    // Refetch
    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.countries).toEqual(updatedCountries);
    });

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('should handle network timeout errors', async () => {
    const mockError: ApiError = {
      message: 'Request timeout',
      status: 408,
    };

    vi.spyOn(countryService, 'fetchCountries').mockRejectedValue(mockError);

    const { result } = renderHook(() => useCountries());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toEqual(mockError);
  });
});
