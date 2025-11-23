import { describe, it, expect } from 'vitest';
import {
  isTaxRecord,
  isCountry,
  isTaxRecordArray,
  isCountryArray,
  isApiError,
  type TaxRecord,
  type Country,
  type ApiError,
} from './index';

describe('Type Guards', () => {
  describe('isTaxRecord', () => {
    it('should return true for valid TaxRecord', () => {
      const validRecord = {
        id: '1',
        name: 'VAT',
        country: 'US',
        rate: 0.2,
      };
      expect(isTaxRecord(validRecord)).toBe(true);
    });

    it('should return false for invalid TaxRecord - missing id', () => {
      const invalidRecord = {
        name: 'VAT',
        country: 'US',
      };
      expect(isTaxRecord(invalidRecord)).toBe(false);
    });

    it('should return false for invalid TaxRecord - missing name', () => {
      const invalidRecord = {
        id: '1',
        country: 'US',
      };
      expect(isTaxRecord(invalidRecord)).toBe(false);
    });

    it('should return false for invalid TaxRecord - missing country', () => {
      const invalidRecord = {
        id: '1',
        name: 'VAT',
      };
      expect(isTaxRecord(invalidRecord)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isTaxRecord(null)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(isTaxRecord('string')).toBe(false);
      expect(isTaxRecord(123)).toBe(false);
      expect(isTaxRecord(undefined)).toBe(false);
    });
  });

  describe('isCountry', () => {
    it('should return true for valid Country', () => {
      const validCountry = {
        id: '1',
        name: 'United States',
        code: 'US',
      };
      expect(isCountry(validCountry)).toBe(true);
    });

    it('should return false for invalid Country - missing id', () => {
      const invalidCountry = {
        name: 'United States',
      };
      expect(isCountry(invalidCountry)).toBe(false);
    });

    it('should return false for invalid Country - missing name', () => {
      const invalidCountry = {
        id: '1',
      };
      expect(isCountry(invalidCountry)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isCountry(null)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(isCountry('string')).toBe(false);
      expect(isCountry(123)).toBe(false);
    });
  });

  describe('isTaxRecordArray', () => {
    it('should return true for valid TaxRecord array', () => {
      const validArray = [
        { id: '1', name: 'VAT', country: 'US' },
        { id: '2', name: 'GST', country: 'CA' },
      ];
      expect(isTaxRecordArray(validArray)).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(isTaxRecordArray([])).toBe(true);
    });

    it('should return false for array with invalid records', () => {
      const invalidArray = [
        { id: '1', name: 'VAT', country: 'US' },
        { id: '2', name: 'GST' }, // missing country
      ];
      expect(isTaxRecordArray(invalidArray)).toBe(false);
    });

    it('should return false for non-array', () => {
      expect(isTaxRecordArray({ id: '1', name: 'VAT', country: 'US' })).toBe(false);
    });
  });

  describe('isCountryArray', () => {
    it('should return true for valid Country array', () => {
      const validArray = [
        { id: '1', name: 'United States' },
        { id: '2', name: 'Canada' },
      ];
      expect(isCountryArray(validArray)).toBe(true);
    });

    it('should return true for empty array', () => {
      expect(isCountryArray([])).toBe(true);
    });

    it('should return false for array with invalid countries', () => {
      const invalidArray = [
        { id: '1', name: 'United States' },
        { id: '2' }, // missing name
      ];
      expect(isCountryArray(invalidArray)).toBe(false);
    });

    it('should return false for non-array', () => {
      expect(isCountryArray({ id: '1', name: 'United States' })).toBe(false);
    });
  });

  describe('isApiError', () => {
    it('should return true for valid ApiError', () => {
      const validError = {
        message: 'Something went wrong',
        status: 500,
      };
      expect(isApiError(validError)).toBe(true);
    });

    it('should return false for invalid ApiError - missing message', () => {
      const invalidError = {
        status: 500,
      };
      expect(isApiError(invalidError)).toBe(false);
    });

    it('should return false for invalid ApiError - missing status', () => {
      const invalidError = {
        message: 'Something went wrong',
      };
      expect(isApiError(invalidError)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isApiError(null)).toBe(false);
    });

    it('should return false for non-object', () => {
      expect(isApiError('error')).toBe(false);
    });
  });
});
