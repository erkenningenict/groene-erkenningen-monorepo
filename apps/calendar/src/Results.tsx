import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { Skeleton } from "@repo/ui/skeleton";
import type { Exam } from "../../api/src/services/exams";
import { Outlet, useSearchParams } from "react-router";
import { Alert } from "@repo/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { hasCodeProperty } from "./utils";

type ResultsProps = {
  label: string;
  certificateTypes: {
    value: string;
    label: string;
  }[];
};

export default function Results({ label, certificateTypes }: ResultsProps) {
  const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
  const [searchParams] = useSearchParams();

  searchParams.delete("sortId");
  searchParams.delete("sortDirection");

  const { data, isLoading, isError, error } = useQuery<Exam[]>({
    queryKey: ["calendar", label, searchParams.toString()],
    queryFn: async () => {
      const response = await fetch(
        `${apiBaseUrl}/calendar/calendar/${label}?meetingType=${searchParams.get("meetingType")}&certificates=${searchParams.getAll("certificates")}&startDate=${searchParams.get("startDate")}&endDate=${searchParams.get("endDate")}&organisation=${searchParams.get("organisation")}&locationType=${searchParams.get("locationType")}&search=${searchParams.get("search")}&zipCode=${searchParams.get("zipCode")}&distance=${searchParams.get("distance")}`,
      );
      const data = await response.json();
      if (!response.ok) {
        throw { code: data.code, message: data.message };
      }
      return data;
    },
  });

  if (isLoading) {
    return (
      <Skeleton>
        <Skeleton className="w-80 h-6" />
        <Skeleton className="w-80 h-10" />
        <Skeleton className="w-80 h-6" />
      </Skeleton>
    );
  }

  if (isError || !data) {
    if (hasCodeProperty(error)) {
      return (
        <Alert variant={"destructive"}>
          {error.code === "ZIP_CODE_NOT_FOUND"
            ? "Postcode niet gevonden, controleer de ingevoerde postcode en zoek opnieuw."
            : ""}
        </Alert>
      );
    }
    return (
      <Alert variant={"destructive"}>
        Er is iets mis gegaan bij het laden van de gegevens. Probeer het later
        opnieuw.
      </Alert>
    );
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        certificateTypes={certificateTypes}
      />
      <Outlet />
    </>
  );
}
