import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchCountries } from './countryService';
import { Country } from '../types';

describe('CountryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('fetchCountries', () => {
    it('should successfully fetch countries', async () => {
      const mockCountries: Country[] = [
        { id: '1', name: 'United Kingdom' },
        { id: '2', name: 'United States' },
        { id: '3', name: 'France' },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockCountries,
      });

      const result = await fetchCountries();

      expect(result).toEqual(mockCountries);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://685013d7e7c42cfd17974a33.mockapi.io/countries',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('should handle HTTP errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
        json: async () => ({}),
      });

      await expect(fetchCountries()).rejects.toEqual({
        message: 'Failed to fetch countries: Service Unavailable',
        status: 503,
      });
    });

    it('should handle network failures', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new Error('Network connection failed')
      );

      await expect(fetchCountries()).rejects.toEqual({
        message: 'Network connection failed',
        status: 0,
      });
    });

    it('should handle invalid response format', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ notAnArray: 'invalid' }),
      });

      await expect(fetchCountries()).rejects.toEqual({
        message: 'Invalid response format from countries API',
        status: 200,
      });
    });

    it('should handle request timeout', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        Object.assign(new Error('Aborted'), { name: 'AbortError' })
      );

      await expect(fetchCountries()).rejects.toEqual({
        message: 'Request timeout',
        status: 408,
      });
    });
  });
});
