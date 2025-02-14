import SearchForm from "./SearchForm";
import type { CalendarStartUpSettings } from "@repo/schemas";
import { Skeleton } from "@repo/ui/skeleton";
import { Alert } from "@repo/ui/alert";
import { useQuery } from "@tanstack/react-query";

type CalendarProps = {
  label: string;
};

export default function Calendar({ label }: CalendarProps) {
  const apiBaseUrl = import.meta.env.VITE_APP_API_URL;

  const { data, isLoading, isError } = useQuery<CalendarStartUpSettings>({
    queryKey: ["calendar", label],
    queryFn: () =>
      fetch(`${apiBaseUrl}/calendar/settings/${label}`).then((res) =>
        res.json(),
      ),
    staleTime: 1000 * 60 * 15,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="w-80 h-6" />
        <Skeleton className="w-80 h-10" />
        <Skeleton className="w-80 h-6" />

        <Skeleton className="w-80 h-6 mt-4" />
        <Skeleton className="w-80 h-10" />
        <Skeleton className="w-80 h-10" />
        <Skeleton className="w-80 h-10" />
        <Skeleton className="w-28 h-10" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <Alert variant={"destructive"}>
        Er is iets mis gegaan bij het laden van de gegevens. Probeer het later
        nog eens.
      </Alert>
    );
  }

  return <SearchForm data={data} label={label} />;
}
