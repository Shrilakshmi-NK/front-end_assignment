import { useState, useCallback } from 'react';
import { TaxRecord } from '../types';

interface UseEditModalReturn {
  isOpen: boolean;
  selectedRecord: TaxRecord | null;
  openModal: (record: TaxRecord) => void;
  closeModal: () => void;
}

/**
 * Custom hook for managing edit modal state
 * Handles opening/closing the modal and tracking the selected record
 */
export function useEditModal(): UseEditModalReturn {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<TaxRecord | null>(null);

  const openModal = useCallback((record: TaxRecord) => {
    setSelectedRecord(record);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Keep selectedRecord until modal animation completes
    // In a real app, you might want to delay clearing this
    setTimeout(() => {
      setSelectedRecord(null);
    }, 300);
  }, []);

  return {
    isOpen,
    selectedRecord,
    openModal,
    closeModal,
  };
}
