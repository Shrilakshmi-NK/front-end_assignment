import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
} from '@tanstack/react-table';
import type { TaxRecord, ApiError } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import './TaxTable.css';

interface TaxTableProps {
  data: TaxRecord[];
  onEdit: (record: TaxRecord) => void;
  isLoading: boolean;
  error?: ApiError | null;
  onRetry?: () => void;
}

const columnHelper = createColumnHelper<TaxRecord>();

export function TaxTable({ data, onEdit, isLoading, error, onRetry }: TaxTableProps) {
  const columns: ColumnDef<TaxRecord, any>[] = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('country', {
      header: 'Country',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (props) => (
        <button
          className="edit-button"
          onClick={() => onEdit(props.row.original)}
          aria-label={`Edit ${props.row.original.name}`}
        >
          ✏️
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading tax records..." />;
  }

  if (error) {
    return <ErrorMessage message={error.message} onRetry={onRetry} />;
  }

  return (
    <div className="tax-table-container" role="region" aria-label="Tax records table">
      <table className="tax-table" aria-label="Tax records" aria-describedby="table-description">
        <caption id="table-description" className="sr-only">
          A table displaying tax records with columns for ID, Name, Country, and Actions. 
          Use the edit button in each row to modify a record.
        </caption>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} scope="col">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="empty-state" role="status" aria-live="polite">
          No tax records found
        </div>
      )}
    </div>
  );
}
