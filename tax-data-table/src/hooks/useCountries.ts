import { useState, useEffect, useCallback } from 'react';
import { Country, ApiError } from '../types';
import { fetchCountries } from '../services/countryService';

interface UseCountriesReturn {
  countries: Country[];
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook for fetching countries
 * Handles loading states and error states
 */
export function useCountries(): UseCountriesReturn {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const countriesData = await fetchCountries();
      setCountries(countriesData);
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err && 'status' in err) {
        setError(err as ApiError);
      } else {
        setError({
          message: 'An unexpected error occurred',
          status: 0,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    countries,
    isLoading,
    error,
    refetch: fetchData,
  };
}
