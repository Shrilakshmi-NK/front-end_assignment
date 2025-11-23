import { useEffect, useRef, useCallback, useState } from 'react';
import type { TaxRecord, Country, ApiError } from '../types';
import { ErrorMessage } from './ErrorMessage';
import './EditModal.css';

interface EditModalProps {
  isOpen: boolean;
  taxRecord: TaxRecord | null;
  countries: Country[];
  onSave: (updatedRecord: Partial<TaxRecord>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  countriesError?: ApiError | null;
  onCountriesRetry?: () => void;
}

export function EditModal({
  isOpen,
  taxRecord,
  countries,
  onSave,
  onCancel,
  isLoading,
  countriesError,
  onCountriesRetry,
}: EditModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLInputElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  
  // Form state
  const [name, setName] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [saveError, setSaveError] = useState<ApiError | null>(null);
  
  // Initialize form values when modal opens or taxRecord changes
  useEffect(() => {
    if (isOpen && taxRecord) {
      setName(taxRecord.name);
      setCountry(taxRecord.country);
      setSaveError(null); // Clear any previous save errors
    }
  }, [isOpen, taxRecord]);
  
  // Validation: check if name is empty or only whitespace
  const isNameValid = name.trim().length > 0;
  const canSave = isNameValid && !isLoading;

  // Handle click outside to close
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onCancel();
      }
    },
    [onCancel]
  );

  // Handle escape key to close and implement focus trap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    const handleTab = (e: KeyboardEvent) => {
      if (!isOpen || e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab on first element -> focus last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      // Tab on last element -> focus first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    if (isOpen) {
      // Store the currently focused element before opening modal
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTab);
      
      // Focus first element when modal opens
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
      
      // Restore focus to the element that was focused before modal opened
      if (!isOpen && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onCancel]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle form submission
  const handleSave = useCallback(async () => {
    if (!canSave || !taxRecord) return;
    
    setSaveError(null); // Clear any previous errors
    
    try {
      await onSave({
        ...taxRecord,
        name: name.trim(),
        country,
      });
    } catch (error) {
      // Display error in modal, keep modal open
      if (error && typeof error === 'object' && 'message' in error && 'status' in error) {
        setSaveError(error as ApiError);
      } else {
        setSaveError({
          message: 'Failed to save changes. Please try again.',
          status: 0,
        });
      }
    }
  }, [canSave, taxRecord, name, country, onSave]);

  if (!isOpen || !taxRecord) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header">
          <h2 id="modal-title">Edit Tax Record</h2>
          <button
            className="modal-close-button"
            onClick={onCancel}
            aria-label="Close modal"
            disabled={isLoading}
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {saveError && (
            <ErrorMessage 
              message={saveError.message} 
              onRetry={handleSave}
            />
          )}
          
          <div className="form-group">
            <label htmlFor="name-input">Name</label>
            <input
              id="name-input"
              ref={firstFocusableRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              aria-label="Tax name"
              aria-invalid={!isNameValid}
            />
            {!isNameValid && name.length > 0 && (
              <span className="error-message" role="alert">
                Name cannot be empty or only whitespace
              </span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="country-select">Country</label>
            {countriesError && (
              <ErrorMessage 
                message={countriesError.message} 
                onRetry={onCountriesRetry}
              />
            )}
            <select
              id="country-select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={isLoading || !!countriesError}
              aria-label="Country"
            >
              {countries.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="modal-actions">
            <button
              className="button button-secondary"
              onClick={onCancel}
              disabled={isLoading}
              aria-label="Cancel editing and close modal"
            >
              Cancel
            </button>
            <button
              ref={lastFocusableRef}
              className="button button-primary"
              onClick={handleSave}
              disabled={!canSave}
              aria-label={isLoading ? 'Saving changes...' : 'Save changes'}
              aria-busy={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
