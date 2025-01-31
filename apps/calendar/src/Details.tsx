import { Alert } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import { Skeleton } from "@repo/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { format, isSameDay, startOfDay } from "date-fns";
import { ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import {
  toDutchDate,
  toDutchDateTime,
  toDutchTime,
} from "../../api/src/utils/dateTimeUtils";

type DetailsProps = {
  label: string;
};

export function Details({ label }: DetailsProps) {
  const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
  const params = useParams();
  const navigate = useNavigate();

  const {
    data: exam,
    isLoading,
    isError,
  } = useQuery<any>({
    queryKey: ["details", params],
    queryFn: async () => {
      const response = await fetch(
        `${apiBaseUrl}/calendar/examenTypeNummer/${params.examenTypeNummer}/examenNummer/${params.examenNummer}/label/${label}`,
      );
      const data = await response.json();
      if (!response.ok) {
        throw { code: data.code, message: data.message };
      }
      return data;
    },
  });

  const handleCloseModal = () => {
    // setTimeout(() => {
    // 	if (
    // 		previousFocusRef.current &&
    // 		previousFocusRef.current instanceof HTMLElement
    // 	) {
    // 		previousFocusRef.current.focus();
    // 	}
    // 	// timeout needed to be able to set the focus after the modal animation is finished
    // }, 300);
    navigate(-1);
  };

  const ReturnLink = () => {
    return (
      <Button
        variant={"secondary"}
        onClick={() => handleCloseModal()}
        className="flex gap-2 items-center"
      >
        Sluiten
      </Button>
    );
  };

  return (
    <Dialog
      defaultOpen
      modal={true}
      open={true}
      onOpenChange={() => handleCloseModal()}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
        </DialogHeader>

        <div>
          {isLoading && (
            <div className="flex flex-col gap-4">
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-full h-8" />
              <Skeleton className="w-40 h-8" />
              <Skeleton className="w-40 h-8" />
              <Skeleton className="w-40 h-6" />
            </div>
          )}

          {isError && (
            <Alert variant={"destructive"}>
              Er is iets mis gegaan bij het laden van de gegevens. Probeer het
              later opnieuw.
            </Alert>
          )}
          {exam && (
            <>
              <div className="bg-primary p-3">
                <h1 className="text-xl md:text-3xl text-white break-word">
                  {exam?.examentype || "Omschrijving onbekend"}
                </h1>

                <div className="text-sm mt-2 text-white text-opacity-80">
                  Nummer: {exam?.examennummer} / Code: {exam?.examentypeCode}
                </div>
              </div>
              <div>
                <div className="text-lg md:mt-2">
                  Datum:{" "}
                  <time
                    className="font-bold"
                    dateTime={toDutchDate(exam?.examendatum)}
                  >
                    {toDutchDate(exam?.examendatum)}{" "}
                  </time>
                </div>

                <p className="text-lg md:mt-2">
                  Van{" "}
                  <time
                    dateTime={toDutchTime(exam?.examendatum)}
                    className="font-bold"
                  >
                    {toDutchTime(exam?.examendatum)}
                  </time>
                  {" tot "}
                  <time
                    className="font-bold"
                    dateTime={
                      isSameDay(
                        startOfDay(new Date(exam?.examendatum ?? new Date())),
                        new Date(exam?.einddatumExamen ?? new Date()),
                      )
                        ? format(
                            new Date(exam?.einddatumExamen || new Date()),
                            "HH:mm",
                          )
                        : toDutchDateTime(exam?.einddatumExamen)
                    }
                  >
                    {isSameDay(
                      startOfDay(new Date(exam?.examendatum ?? new Date())),
                      new Date(exam?.einddatumExamen ?? new Date()),
                    )
                      ? format(
                          new Date(exam?.einddatumExamen || new Date()),
                          "HH:mm",
                        )
                      : toDutchDateTime(exam?.einddatumExamen)}
                  </time>
                </p>
                <div className="text-lg md:text-xl md:mt-2">
                  Prijs: <span className="font-bold">{exam?.prijs} </span>
                </div>
              </div>

              {exam?.url && (
                <Button asChild variant={"default"} className="my-4">
                  <a
                    href={exam?.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    Aanmelden via aanbieder
                    <ChevronRight />
                  </a>
                </Button>
              )}

              <div>
                <div className="text-lg font-bold mt-1 md:mt-2">Locatie:</div>
                <address>
                  <div>{exam?.locatieNaam}</div>
                  {exam?.locatiePostcode !== "0000 ZZ" && (
                    <div>{exam?.locatiePostcode}</div>
                  )}
                  {exam?.locatiePlaats !== "NIET GEBRUIKEN" && (
                    <div>{exam?.locatiePlaats}</div>
                  )}
                </address>
              </div>

              <div>
                {exam?.organisatorBedrijfsnaam && (
                  <div className="text-lg font-bold mt-1 md:mt-2">
                    Aanbieder:
                  </div>
                )}
                <div>{exam?.organisatorBedrijfsnaam}</div>
                <div>
                  {exam?.organisatorStraat} {exam?.organisatorHuisnummer}{" "}
                  {exam?.organisatorToevoeging}
                </div>
                <div>{exam?.organisatorPlaats}</div>
                <div>
                  <a
                    className="underline hover:text-primary transition-colors"
                    href={`mailto:${exam?.organisatorEmail}`}
                  >
                    {exam?.organisatorEmail}
                  </a>
                </div>
                <div>
                  <a
                    className="underline hover:text-primary transition-colors"
                    href={`tel:${exam?.organisatorTelefoon}`}
                  >
                    {exam?.organisatorTelefoon}
                  </a>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <ReturnLink />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
