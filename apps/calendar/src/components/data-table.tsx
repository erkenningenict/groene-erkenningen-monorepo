import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/table";
import { useState } from "react";
import { useSearchParams } from "react-router";
import type { Exam } from "../../../api/src/services/exams";
import type { SelectedExam } from "../Results";
import { DataTablePagination } from "./data-table-pagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  certificateTypes: {
    value: string;
    label: string;
  }[];
  onSelect: ({ examenTypeNummer, examenNummer }: SelectedExam) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  certificateTypes,
  onSelect,
}: DataTableProps<TData, TValue>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortId = searchParams.get("sortId") ?? "examenDatum";
  const sortDirection = searchParams.get("sortDirection") ?? "asc";

  const [sorting, setSorting] = useState<SortingState>([
    { id: sortId, desc: sortDirection === "desc" },
  ]);
  const locationType = searchParams.get("locationType") ?? "[Alle]";

  const zipCode = searchParams.get("zipCode") ?? "";

  const isWebinar = locationType === "Webinar";
  const queryDistance = !isWebinar && zipCode !== "";

  const allPricesZero = (data as Exam[])?.every(
    (examMoment) => parseFloat((examMoment.prijs ?? 0).toString()) === 0,
  );
  const allCertificatesEqualTitle = (data as Exam[])?.every(
    (examMoment) => examMoment.certificaatType === examMoment.typeExamen,
  );
  const allOrganisatieBedrijfsnaamEmpty = (data as Exam[])?.every(
    (examMoment) => examMoment.organisatorBedrijfsnaam === "",
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: (updater) => {
      const newSorting =
        updater instanceof Function ? updater(sorting) : updater;

      if (newSorting.at(0)) {
        searchParams.delete("sortId");
        searchParams.delete("sortDirection");
        searchParams.append("sortId", newSorting.at(0)!.id);
        searchParams.append(
          "sortDirection",
          newSorting[0].desc ? "desc" : "asc",
        );
        setSearchParams(searchParams);
      }

      setSorting(updater);
    },
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility: {
        certificaatType: !!(
          certificateTypes.length > 0 && !allCertificatesEqualTitle === true
        ),
        afstandInKm: queryDistance,
        locatiePlaats: !isWebinar,
        prijs: !allPricesZero,
        kennisaanbieder: !allOrganisatieBedrijfsnaamEmpty,
      },
    },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border">
        <div className="p-4 flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows?.length} gevonden
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="even:bg-gray-200 hover:bg-slate-200 transition cursor-pointer"
                  onClick={() =>
                    onSelect({
                      examenTypeNummer: (
                        row.original as { examenTypeNummer: string }
                      ).examenTypeNummer,
                      examenNummer: (row.original as { examenNummer: string })
                        .examenNummer,
                    })
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Geen resultaten gevonden. Controleer de filter instellingen.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
