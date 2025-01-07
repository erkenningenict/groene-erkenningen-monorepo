import { Alert } from "@repo/ui/alert";
import { CheckCircle } from "lucide-react";
import type { Student } from "../../api/src/services/check-certificaat.server";
import { toDutchDate } from "../../api/src/utils/dateTimeUtils";

type StudentsProps = {
  students: Student[];
};

export default function Students({ students }: StudentsProps) {
  return (
    <div className="flex">
      <ul
        aria-label="Search results"
        data-testid="search-results"
        className="flex flex-col gap-3"
      >
        {students?.length === 0 ? (
          <Alert variant="warning">
            Er zijn geen resultaten beschikbaar. Pas de zoekcriteria aan.
          </Alert>
        ) : (
          students?.map((student, index) => (
            <li
              key={`${student?.id}${index}`}
              className="border-t border-gray-500 pt-3 flex flex-col gap-1"
            >
              <div className="text-primary text-xl">
                {student?.initialen} {student?.achternaam}
              </div>
              <div>Geboortejaar: {student?.geboorteJaar}</div>
              <div className="flex gap-2">
                <CheckCircle className="shrink-0" />
                <div className="flex xs:gap-0 flex-col">
                  <span>{student?.certificaten[0].certCode}</span>
                  <span className="tabular-nums">
                    Uitgegeven op{" "}
                    {toDutchDate(student?.certificaten[0].beginDatum)} en geldig
                    tot {toDutchDate(student?.certificaten[0].eindDatum)}
                  </span>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
