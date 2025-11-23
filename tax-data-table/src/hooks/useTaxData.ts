import { useState, useEffect, useCallback } from 'react';
import { TaxRecord, ApiError } from '../types';
import { fetchTaxes, updateTax } from '../services/taxService';

interface UseTaxDataReturn {
  data: TaxRecord[];
  isLoading: boolean;
  isSaving: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  updateRecord: (id: string, updates: Partial<TaxRecord>) => Promise<void>;
}

/**
 * Custom hook for fetching and managing tax records
 * Handles loading states, error states, and provides methods to refetch and update records
 */
export function useTaxData(): UseTaxDataReturn {
  const [data, setData] = useState<TaxRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const taxes = await fetchTaxes();
      setData(taxes);
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

  const updateRecord = useCallback(async (id: string, updates: Partial<TaxRecord>) => {
    setIsSaving(true);
    try {
      await updateTax(id, updates);
      // Refetch data after successful update
      await fetchData();
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err && 'status' in err) {
        throw err as ApiError;
      } else {
        throw {
          message: 'Failed to update tax record',
          status: 0,
        } as ApiError;
      }
    } finally {
      setIsSaving(false);
    }
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isSaving,
    error,
    refetch: fetchData,
    updateRecord,
  };
}
