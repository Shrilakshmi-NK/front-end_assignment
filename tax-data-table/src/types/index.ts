/**
 * Represents a tax record entity from the API
 */
export interface TaxRecord {
  id: string;
  name: string;
  country: string;
  // Additional fields from API are preserved
  [key: string]: any;
}

/**
 * Represents a country option for the dropdown
 */
export interface Country {
  id: string;
  name: string;
  // Additional fields from API are preserved
  [key: string]: any;
}

/**
 * Represents an API error response
 */
export interface ApiError {
  message: string;
  status: number;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

/**
 * Type guard to check if a value is a valid TaxRecord
 */
export function isTaxRecord(value: unknown): value is TaxRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.country === 'string'
  );
}

/**
 * Type guard to check if a value is a valid Country
 */
export function isCountry(value: unknown): value is Country {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const country = value as Record<string, unknown>;

  return (
    typeof country.id === 'string' &&
    typeof country.name === 'string'
  );
}

/**
 * Type guard to check if a value is an array of TaxRecords
 */
export function isTaxRecordArray(value: unknown): value is TaxRecord[] {
  return Array.isArray(value) && value.every(isTaxRecord);
}

/**
 * Type guard to check if a value is an array of Countries
 */
export function isCountryArray(value: unknown): value is Country[] {
  return Array.isArray(value) && value.every(isCountry);
}

/**
 * Type guard to check if a value is an ApiError
 */
export function isApiError(value: unknown): value is ApiError {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const error = value as Record<string, unknown>;

  return (
    typeof error.message === 'string' &&
    typeof error.status === 'number'
  );
}
