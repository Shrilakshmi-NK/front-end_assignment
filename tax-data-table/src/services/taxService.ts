import { TaxRecord, ApiError, isTaxRecordArray } from '../types';

const API_BASE_URL = 'https://685013d7e7c42cfd17974a33.mockapi.io';
const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * Creates an AbortController with timeout
 */
function createTimeoutController(timeoutMs: number): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
}

/**
 * Handles API errors and converts them to ApiError format
 */
function handleApiError(error: unknown, defaultMessage: string): never {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      const apiError: ApiError = {
        message: 'Request timeout',
        status: 408,
      };
      throw apiError;
    }
    
    const apiError: ApiError = {
      message: error.message || defaultMessage,
      status: 0, // Network error
    };
    throw apiError;
  }
  
  const apiError: ApiError = {
    message: defaultMessage,
    status: 0,
  };
  throw apiError;
}

/**
 * Fetches all tax records from the API
 */
export async function fetchTaxes(): Promise<TaxRecord[]> {
  const controller = createTimeoutController(REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(`${API_BASE_URL}/taxes`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      const apiError: ApiError = {
        message: `Failed to fetch taxes: ${response.statusText}`,
        status: response.status,
      };
      throw apiError;
    }

    const data = await response.json();

    if (!isTaxRecordArray(data)) {
      const apiError: ApiError = {
        message: 'Invalid response format from taxes API',
        status: response.status,
      };
      throw apiError;
    }

    return data;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error; // Already an ApiError
    }
    return handleApiError(error, 'Failed to fetch taxes');
  }
}

/**
 * Updates a tax record via PUT request
 * Preserves all existing fields and updates only the provided fields
 */
export async function updateTax(
  id: string,
  updates: Partial<TaxRecord>
): Promise<TaxRecord> {
  const controller = createTimeoutController(REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}/taxes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
      signal: controller.signal,
    });

    if (!response.ok) {
      const apiError: ApiError = {
        message: `Failed to update tax: ${response.statusText}`,
        status: response.status,
      };
      throw apiError;
    }

    const data = await response.json();

    return data as TaxRecord;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error; // Already an ApiError
    }
    return handleApiError(error, 'Failed to update tax');
  }
}
