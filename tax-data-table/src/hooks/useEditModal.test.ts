import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useEditModal } from './useEditModal';
import { TaxRecord } from '../types';

describe('useEditModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with modal closed and no selected record', () => {
    const { result } = renderHook(() => useEditModal());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedRecord).toBeNull();
  });

  it('should open modal with selected record', () => {
    const mockRecord: TaxRecord = {
      id: '1',
      name: 'Tax A',
      country: 'USA',
    };

    const { result } = renderHook(() => useEditModal());

    act(() => {
      result.current.openModal(mockRecord);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedRecord).toEqual(mockRecord);
  });

  it('should close modal and clear selected record after delay', () => {
    const mockRecord: TaxRecord = {
      id: '1',
      name: 'Tax A',
      country: 'USA',
    };

    const { result } = renderHook(() => useEditModal());

    // Open modal
    act(() => {
      result.current.openModal(mockRecord);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedRecord).toEqual(mockRecord);

    // Close modal
    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.selectedRecord).toEqual(mockRecord); // Still set immediately after close

    // Fast-forward time to clear selected record
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.selectedRecord).toBeNull();
  });

  it('should handle multiple open/close cycles', () => {
    const mockRecord1: TaxRecord = {
      id: '1',
      name: 'Tax A',
      country: 'USA',
    };

    const mockRecord2: TaxRecord = {
      id: '2',
      name: 'Tax B',
      country: 'Canada',
    };

    const { result } = renderHook(() => useEditModal());

    // First cycle
    act(() => {
      result.current.openModal(mockRecord1);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedRecord).toEqual(mockRecord1);

    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isOpen).toBe(false);

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Second cycle
    act(() => {
      result.current.openModal(mockRecord2);
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.selectedRecord).toEqual(mockRecord2);
  });

  it('should update selected record when opening with different record', () => {
    const mockRecord1: TaxRecord = {
      id: '1',
      name: 'Tax A',
      country: 'USA',
    };

    const mockRecord2: TaxRecord = {
      id: '2',
      name: 'Tax B',
      country: 'Canada',
    };

    const { result } = renderHook(() => useEditModal());

    act(() => {
      result.current.openModal(mockRecord1);
    });

    expect(result.current.selectedRecord).toEqual(mockRecord1);

    // Open with different record without closing first
    act(() => {
      result.current.openModal(mockRecord2);
    });

    expect(result.current.selectedRecord).toEqual(mockRecord2);
    expect(result.current.isOpen).toBe(true);
  });
});
