import useFetch from "@repo/ui/hooks/useFetch";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import { Skeleton } from "@repo/ui/skeleton";
import type { Exam } from "../../api/src/services/exams";
import { useSearchParams } from "react-router";

type ResultsProps = {
  label: string;
};
export default function Results({ label }: ResultsProps) {
  const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
  const [searchParams] = useSearchParams();

  const { data, isLoading, isError } = useFetch<Exam[]>(
    `${apiBaseUrl}/calendar/calendar/${label}?meetingType=${searchParams.get("meetingType")}&certificate=${searchParams.get("certificate")}&startDate=${searchParams.get("startDate")}&endDate=${searchParams.get("endDate")}&organisation=${searchParams.get("organisation")}&locationType=${searchParams.get("locationType")}&search=${searchParams.get("search")}&zipCode=${searchParams.get("zipCode")}&distance=${searchParams.get("distance")}`,
  );
  // console.log("#DH# dat", data);

  // const table = useReactTable({
  // 	data: examMoments,
  // 	columns,
  // 	state: {
  // 		sorting,
  // 		columnVisibility: {
  // 			certificaatType: !!(
  // 				certificateTypes.length > 0 && !allCertificatesEqualTitle === true
  // 			),
  // 			afstandInKm: queryDistance,
  // 			locatiePlaats: !isWebinar,
  // 			prijs: !allPricesZero,
  // 			kennisaanbieder: !allOrganisatieBedrijfsnaamEmpty,
  // 		},
  // 	},
  // 	onSortingChange: setSorting,
  // 	getCoreRowModel: getCoreRowModel(),
  // 	getFilteredRowModel: getFilteredRowModel(),
  // 	getPaginationRowModel: getPaginationRowModel(),
  // 	initialState: {
  // 		pagination: {
  // 			pageSize: 10,
  // 		},
  // 	},
  // 	getSortedRowModel: getSortedRowModel(),
  // });

  if (isLoading || data === null) {
    return (
      <Skeleton>
        <Skeleton className="w-80 h-6" />
        <Skeleton className="w-80 h-10" />
        <Skeleton className="w-80 h-6" />
      </Skeleton>
    );
  }

  if (isError) {
    return <div>Er is iets mis gegaan bij het laden van de gegevens.</div>;
  }

  return <DataTable columns={columns} data={data} />;
}
