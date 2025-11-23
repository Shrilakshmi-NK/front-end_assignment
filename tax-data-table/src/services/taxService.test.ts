import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchTaxes, updateTax } from './taxService';
import { TaxRecord } from '../types';

describe('TaxService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('fetchTaxes', () => {
    it('should successfully fetch tax records', async () => {
      const mockTaxes: TaxRecord[] = [
        { id: '1', name: 'VAT', country: 'UK' },
        { id: '2', name: 'Sales Tax', country: 'US' },
      ];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockTaxes,
      });

      const result = await fetchTaxes();

      expect(result).toEqual(mockTaxes);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://685013d7e7c42cfd17974a33.mockapi.io/taxes',
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('should handle HTTP errors', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({}),
      });

      await expect(fetchTaxes()).rejects.toEqual({
        message: 'Failed to fetch taxes: Internal Server Error',
        status: 500,
      });
    });

    it('should handle network failures', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(fetchTaxes()).rejects.toEqual({
        message: 'Network error',
        status: 0,
      });
    });

    it('should handle invalid response format', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ invalid: 'data' }),
      });

      await expect(fetchTaxes()).rejects.toEqual({
        message: 'Invalid response format from taxes API',
        status: 200,
      });
    });

    it('should handle request timeout', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        Object.assign(new Error('Aborted'), { name: 'AbortError' })
      );

      await expect(fetchTaxes()).rejects.toEqual({
        message: 'Request timeout',
        status: 408,
      });
    });
  });

  describe('updateTax', () => {
    it('should successfully update a tax record', async () => {
      const mockUpdatedTax: TaxRecord = {
        id: '1',
        name: 'Updated VAT',
        country: 'France',
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockUpdatedTax,
      });

      const updates = { name: 'Updated VAT', country: 'France' };
      const result = await updateTax('1', updates);

      expect(result).toEqual(mockUpdatedTax);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://685013d7e7c42cfd17974a33.mockapi.io/taxes/1',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
          signal: expect.any(AbortSignal),
        })
      );
    });

    it('should format request payload correctly', async () => {
      const mockTax: TaxRecord = {
        id: '1',
        name: 'VAT',
        country: 'UK',
        rate: 20,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockTax,
      });

      const updates = { name: 'VAT', country: 'UK' };
      await updateTax('1', updates);

      const callArgs = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body).toEqual(updates);
      expect(callArgs[1].headers['Content-Type']).toBe('application/json');
    });

    it('should handle HTTP errors during update', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({}),
      });

      await expect(updateTax('999', { name: 'Test' })).rejects.toEqual({
        message: 'Failed to update tax: Not Found',
        status: 404,
      });
    });

    it('should handle network failures during update', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(updateTax('1', { name: 'Test' })).rejects.toEqual({
        message: 'Network error',
        status: 0,
      });
    });

    it('should handle request timeout during update', async () => {
      (global.fetch as any).mockRejectedValueOnce(
        Object.assign(new Error('Aborted'), { name: 'AbortError' })
      );

      await expect(updateTax('1', { name: 'Test' })).rejects.toEqual({
        message: 'Request timeout',
        status: 408,
      });
    });
  });
});
