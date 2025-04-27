import React, { useState } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  getFilteredRowModel,
  ColumnDef, 
  SortingState,
  ColumnFiltersState,
  flexRender
} from '@tanstack/react-table';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ArrowUp, 
  ArrowDown,
  Search
} from 'lucide-react';

interface PaginationProps {
  pageCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

interface SortingProps {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange: (field: string, direction: 'asc' | 'desc') => void;
}

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  pagination?: PaginationProps;
  sorting?: SortingProps;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  bulkActions?: React.ReactNode;
  isLoading?: boolean;
}

export function DataTable<TData>({ 
  data, 
  columns, 
  pagination,
  sorting,
  enableRowSelection,
  onRowSelectionChange,
  bulkActions,
  isLoading = false
}: DataTableProps<TData>) {
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  
  // Initialize sorting state from props
  const [sortingState, setSortingState] = useState<SortingState>(
    sorting?.sortBy && sorting?.sortDirection 
      ? [{ id: sorting.sortBy, desc: sorting.sortDirection === 'desc' }]
      : []
  );
  
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sortingState,
      columnFilters,
      rowSelection,
      globalFilter,
      pagination: pagination 
        ? { 
            pageIndex: pagination.page, 
            pageSize: pagination.pageSize 
          } 
        : undefined,
    },
    enableRowSelection: !!enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (updatedSorting) => {
      const newSorting = updatedSorting as SortingState;
      setSortingState(newSorting);
      
      // Call the parent's sort handler if available
      if (sorting?.onSortChange && newSorting.length > 0) {
        const { id, desc } = newSorting[0];
        sorting.onSortChange(id, desc ? 'desc' : 'asc');
      }
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: !!pagination, // Use manual pagination if pagination props are provided
    manualSorting: !!sorting, // Use manual sorting if sorting props are provided
    pageCount: pagination?.pageCount || -1,
  });

  // Callback when row selection changes
  React.useEffect(() => {
    if (onRowSelectionChange) {
      const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, onRowSelectionChange, table]);

  return (
    <div className="w-full animate-fade-in">
      {/* Search Input */}
      {!pagination && (
        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search..."
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {bulkActions && table.getSelectedRowModel().rows.length > 0 && (
        <div className="flex items-center justify-between gap-2 mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-md animate-fade-in">
          <span className="text-sm font-medium text-indigo-700">
            {table.getSelectedRowModel().rows.length} item{table.getSelectedRowModel().rows.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">{bulkActions}</div>
        </div>
      )}

      {/* Table */}
      <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs uppercase tracking-wider font-medium text-gray-700 border-b border-gray-200">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className="px-4 py-3"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort() 
                            ? 'cursor-pointer select-none flex items-center gap-1 group' 
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        
                        {header.column.getCanSort() && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            {header.column.getIsSorted() === 'asc' ? (
                              <ArrowUp className="w-4 h-4 text-indigo-600" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ArrowDown className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <div className="w-4 h-4 text-gray-300">⋮</div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-3 text-center">
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <tr 
                  key={row.id} 
                  className={`border-b hover:bg-gray-50 transition-colors ${row.getIsSelected() ? 'bg-indigo-50' : ''}`}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14h.01M12 20h.01M4 4h16a1 1 0 011 1v10a1 1 0 01-1 1h-4l-4 4-4-4H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
                    </svg>
                    <p className="text-base">No results found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination ? (
        <div className="flex flex-wrap items-center justify-between gap-y-3 mt-4">
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={pagination.pageSize}
              onChange={e => {
                pagination.onPageSizeChange(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600">
              Page {pagination.page + 1} of {pagination.pageCount || 1}
            </span>
          </div>
          
          <div className="flex items-center justify-end">
            <span className="text-sm text-gray-500 mr-4">
              {pagination.page * pagination.pageSize + 1}-
              {Math.min((pagination.page + 1) * pagination.pageSize, data.length)} of {data.length}
            </span>
            
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 border rounded-md disabled:opacity-50 transition-colors hover:bg-gray-50"
                onClick={() => pagination.onPageChange(0)}
                disabled={pagination.page <= 0}
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                className="p-1.5 border rounded-md disabled:opacity-50 transition-colors hover:bg-gray-50"
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 0}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                className="p-1.5 border rounded-md disabled:opacity-50 transition-colors hover:bg-gray-50"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pageCount - 1}
              >
                <ChevronRight size={16} />
              </button>
              <button
                className="p-1.5 border rounded-md disabled:opacity-50 transition-colors hover:bg-gray-50"
                onClick={() => pagination.onPageChange(pagination.pageCount - 1)}
                disabled={pagination.page >= pagination.pageCount - 1}
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}