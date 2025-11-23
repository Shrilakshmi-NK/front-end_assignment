import { TaxTable, EditModal } from '../components';
import { useTaxData } from '../hooks/useTaxData';
import { useCountries } from '../hooks/useCountries';
import { useEditModal } from '../hooks/useEditModal';
import type { TaxRecord } from '../types';

export function TaxTablePage() {
  const { data, isLoading, error, refetch, updateRecord, isSaving } = useTaxData();
  const { countries, isLoading: countriesLoading, error: countriesError, refetch: refetchCountries } = useCountries();
  const { isOpen, selectedRecord, openModal, closeModal } = useEditModal();

  const handleEdit = (record: TaxRecord) => {
    openModal(record);
  };

  const handleSave = async (updatedRecord: Partial<TaxRecord>) => {
    if (!selectedRecord) return;
    
    await updateRecord(selectedRecord.id, updatedRecord);
    closeModal();
  };

  return (
    <div className="tax-table-page">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header role="banner">
        <h1 id="page-title">Tax Data Management</h1>
      </header>
      <main id="main-content" role="main" aria-labelledby="page-title">
        <TaxTable 
          data={data} 
          onEdit={handleEdit} 
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
        />
      </main>
      <EditModal
        isOpen={isOpen}
        taxRecord={selectedRecord}
        countries={countries}
        onSave={handleSave}
        onCancel={closeModal}
        isLoading={isSaving || countriesLoading}
        countriesError={countriesError}
        onCountriesRetry={refetchCountries}
      />
    </div>
  );
}
