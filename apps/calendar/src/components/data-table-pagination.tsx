import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@repo/ui/button";
import { NativeSelect } from "@repo/ui/native-select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-center w-full space-x-1 lg:space-x-8">
      <div className="flex items-center space-x-2">
        <p className="text-sm font-medium">Rijen per pagina</p>
        <NativeSelect
          className="w-fit"
          value={`${table.getState().pagination.pageSize}`}
          onChange={(event) => {
            table.setPageSize(Number(event.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </option>
          ))}
        </NativeSelect>
      </div>
      <div className="flex w-[110px] items-center justify-center text-sm font-medium">
        Pagina {table.getState().pagination.pageIndex + 1} van{" "}
        {table.getPageCount()}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 md:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Naar eerste pagina</span>
          <ChevronsLeft />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Naar vorige pagina</span>
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Naar volgende pagina</span>
          <ChevronRight />
        </Button>
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 md:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Naar laatste pagina</span>
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
