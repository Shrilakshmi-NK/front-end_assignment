import { Country, ApiError, isCountryArray } from '../types';

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
 * Fetches all countries from the API
 */
export async function fetchCountries(): Promise<Country[]> {
  const controller = createTimeoutController(REQUEST_TIMEOUT);
  
  try {
    const response = await fetch(`${API_BASE_URL}/countries`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      const apiError: ApiError = {
        message: `Failed to fetch countries: ${response.statusText}`,
        status: response.status,
      };
      throw apiError;
    }

    const data = await response.json();

    if (!isCountryArray(data)) {
      const apiError: ApiError = {
        message: 'Invalid response format from countries API',
        status: response.status,
      };
      throw apiError;
    }

    return data;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      throw error; // Already an ApiError
    }
    return handleApiError(error, 'Failed to fetch countries');
  }
}
