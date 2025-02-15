import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRight } from "lucide-react";
import type { Exam } from "../../../api/src/services/exams";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Button } from "@repo/ui/button";

export const columns: ColumnDef<Exam>[] = [
  {
    accessorFn: (row) => row.examenNummer,
    id: "examenNummer",
    cell: () => {
      return (
        <Button variant={"ghost"} size={"icon"}>
          <ChevronRight />
        </Button>
      );
    },
    header: () => <></>,
  },
  {
    accessorFn: (row) => row.examenDatum,
    id: "examenDatum",
    cell: ({ row }) => {
      const date = new Date(row.getValue("examenDatum"));
      const formatted = new Intl.DateTimeFormat("nl-NL", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(date);
      return <div className="text-right">{formatted}</div>;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Datum/tijd" />
    ),
  },
  {
    id: "certificaatType",
    accessorFn: (row) => row.certificaatType,
    cell: (info) => info.getValue() || "Onbekend",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Certificaat" />
    ),
    enableSorting: true,
  },
  {
    id: "typeExamen",
    accessorFn: (row) => row.typeExamen,
    cell: (info) => info.getValue() || "Onbekend",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Titel" />
    ),
  },
  {
    id: "locatieNaam",
    accessorFn: (row) => row.locatieNaam,
    cell: (info) => info.getValue(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Locatie" />
    ),
  },
  {
    id: "locatiePlaats",
    accessorFn: (row) => row.locatiePlaats,
    cell: (info) =>
      info.getValue() === "NIET GEBRUIKEN" ? "N.v.t." : info.getValue(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plaats" />
    ),
  },
  {
    id: "afstandInKm",
    accessorFn: (row) => row.distance,
    cell: (info) => ((info.getValue() || 0) as number).toFixed(0),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Afstand" />
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "kennisaanbieder",
    accessorFn: (row) => row.organisatorBedrijfsnaam,
    cell: (info) => info.getValue(),
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Aanbieder" />
    ),
  },
  {
    id: "prijs",
    accessorFn: (row) => row.prijs,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("prijs"));
      const formatted = new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
      return <div className="text-right">{formatted}</div>;
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prijs" />
    ),
  },
];
