// ReusableTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, Database } from "lucide-react";

interface Column<T> {
  label?: string;
  header?: string;
  key?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface ReusableTableProps<T> {
  title: string;
  icon?: React.ReactNode;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  data: T[];
  columns: Column<T>[];
  searchInput?: React.ReactNode;
  emptyMessage?: string;
  showRowNumbers?: boolean;
  striped?: boolean;
  compact?: boolean;
}

function ReusableTable<T>({
  isLoading,
  isError,
  errorMessage = "Something went wrong",
  data,
  columns,
  searchInput,
  emptyMessage = "No data found",
  showRowNumbers = false,
  striped = true,
  compact = false,
}: ReusableTableProps<T>) {
  console.log('Table data:', data);
  console.log('Table columns:', columns);

  // Helper function to get column label
  const getColumnLabel = (col: Column<T>) => col.label || col.header || '';

  // Helper function to render cell content
  const renderCellContent = (col: Column<T>, row: T, index: number) => {
    if (col.render) {
      return col.render(row, index);
    }
    if (col.key) {
      const value = row[col.key];
      return value !== null && value !== undefined ? String(value) : '';
    }
    return '';
  };

  // Prepare columns with optional row numbers
  const tableColumns = showRowNumbers 
    ? [{ label: '#', render: (_: T, index: number) => index + 1, width: '60px', align: 'center' as const }, ...columns]
    : columns;

  return (
    <div className="space-y-6">
      {/* Search Input */}
      {searchInput && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          {searchInput}
        </div>
      )}

      {/* Main Table Card */}
      <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 overflow-hidden py-0">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
              <span className="text-blue-700 dark:text-blue-400 font-medium">Loading data...</span>
            </div>
          ) : isError ? (
            <div className="flex flex-col justify-center items-center py-16 bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-900">
              <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
              <span className="text-red-600 dark:text-red-400 font-medium">{errorMessage}</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-950 to-blue-900 border-none">
                    {tableColumns.map((col, i) => (
                      <TableHead 
                        key={i} 
                        className={`text-white font-semibold py-4 px-6 text-sm uppercase tracking-wide ${
                          col.align === 'center' ? 'text-center' : 
                          col.align === 'right' ? 'text-right' : 'text-left'
                        }`}
                        style={{ width: col.width }}
                      >
                        {getColumnLabel(col)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length > 0 ? (
                    data.map((row, rowIndex) => (
                      <TableRow 
                        key={rowIndex}
                        className={`
                          border-b border-gray-100 dark:border-gray-700 
                          hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 
                          dark:hover:from-gray-700 dark:hover:to-gray-600 
                          transition-all duration-200 ease-in-out
                          ${striped && rowIndex % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'}
                        `}
                      >
                        {tableColumns.map((col, colIndex) => (
                          <TableCell 
                            key={colIndex}
                            className={`
                              ${compact ? 'py-2 px-4' : 'py-4 px-6'} 
                              text-gray-900 dark:text-gray-100 
                              ${col.align === 'center' ? 'text-center' : 
                                col.align === 'right' ? 'text-right' : 'text-left'}
                            `}
                          >
                            <div className="flex items-center">
                              {renderCellContent(col, row, rowIndex)}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={tableColumns.length}
                        className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <Database className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                            {emptyMessage}
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm">
                            No records match your current filters
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ReusableTable;