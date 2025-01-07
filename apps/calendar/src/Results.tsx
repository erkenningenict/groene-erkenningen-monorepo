import useFetch from "@repo/ui/hooks/useFetch";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { Skeleton } from "@repo/ui/skeleton";
import type { Exam } from "../../api/src/services/exams";
import { useSearchParams } from "react-router";
import { Alert } from "@repo/ui/alert";

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

  const { data, isLoading, isError, error } = useFetch<Exam[]>(
    `${apiBaseUrl}/calendar/calendar/${label}?meetingType=${searchParams.get("meetingType")}&certificate=${searchParams.get("certificate")}&startDate=${searchParams.get("startDate")}&endDate=${searchParams.get("endDate")}&organisation=${searchParams.get("organisation")}&locationType=${searchParams.get("locationType")}&search=${searchParams.get("search")}&zipCode=${searchParams.get("zipCode")}&distance=${searchParams.get("distance")}`,
  );

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
    if (error) {
      console.log("#DH# error in code", error);
    }
    return (
      <Alert variant={"destructive"}>
        Er is iets mis gegaan bij het laden van de gegevens. Probeer het later
        opnieuw.
      </Alert>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={data}
      certificateTypes={certificateTypes}
    />
  );
}
