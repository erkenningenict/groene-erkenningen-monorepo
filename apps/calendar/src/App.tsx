import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import Spinner from "@repo/ui/spinner";

import { useState } from "react";

function App() {
  const [open, setOpen] = useState(false);

  const handleCloseModal = () => {
    setOpen(false);
    setTimeout(() => {
      // if (
      // previousFocusRef.current &&
      // previousFocusRef.current instanceof HTMLElement
      // ) {
      // previousFocusRef.current.focus();
      // }
      // timeout needed to be able to set the focus after the modal animation is finished
    }, 300);
    // navigate(-1);
  };
  return (
    <>
      <div className="text-primary">Test</div>
      <Button variant={"destructive"} onClick={() => setOpen(true)}>
        test
      </Button>
      <Dialog defaultOpen open={open} onOpenChange={() => handleCloseModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Details</DialogTitle>
          </DialogHeader>
          Test
          <Spinner />
          {/* <Suspense fallback={<Spinner />}> */}
          {/* <Await
						resolve={data.losExamenmoment}
						errorElement={
							<Alert type="error">
								De bijeenkomst is niet gevonden. Probeer het later opnieuw.
							</Alert>
						}
					>
						{(examen) => (
							<>
								<div className="bg-primary p-3">
									<h1 className="text-xl md:text-3xl text-white break-word">
										{examen?.examentype || "Omschrijving onbekend"}
									</h1>

									<div className="text-sm mt-2 text-white text-opacity-80">
										Nummer: {examen?.examennummer} / Code:{" "}
										{examen?.examentypeCode}
									</div>
								</div>
								<div>
									<div className="text-lg md:mt-2">
										Datum:{" "}
										<time
											className="font-bold"
											dateTime={toDutchDate(examen?.examendatum)}
										>
											{toDutchDate(examen?.examendatum)}{" "}
										</time>
									</div>

									<p className="text-lg md:mt-2">
										Van{" "}
										<time
											dateTime={toDutchTime(examen?.examendatum)}
											className="font-bold"
										>
											{toDutchTime(examen?.examendatum)}
										</time>
										{" tot "}
										<time
											className="font-bold"
											dateTime={
												isSameDay(
													startOfDay(
														new Date(examen?.examendatum ?? new Date()),
													),
													new Date(examen?.einddatumExamen ?? new Date()),
												)
													? format(
															new Date(examen?.einddatumExamen || new Date()),
															"HH:mm",
														)
													: toDutchDateTime(examen?.einddatumExamen)
											}
										>
											{isSameDay(
												startOfDay(new Date(examen?.examendatum ?? new Date())),
												new Date(examen?.einddatumExamen ?? new Date()),
											)
												? format(
														new Date(examen?.einddatumExamen || new Date()),
														"HH:mm",
													)
												: toDutchDateTime(examen?.einddatumExamen)}
										</time>
									</p>
									<div className="text-lg md:text-xl md:mt-2">
										Prijs: <span className="font-bold">{examen?.prijs} </span>
									</div>
								</div>

								{examen?.url && (
									<Button asChild variant={"default"}>
										<a
											href={examen?.url}
											target="_blank"
											rel="nofollow noopener noreferrer"
										>
											Aanmelden via aanbieder
											<IconChevronRight />
										</a>
									</Button>
								)}

								<div>
									<div className="text-lg font-bold mt-1 md:mt-2">Locatie:</div>
									<address>
										<div>{examen?.locatieNaam}</div>
										{examen?.locatiePostcode !== "0000 ZZ" && (
											<div>{examen?.locatiePostcode}</div>
										)}
										{examen?.locatiePlaats !== "NIET GEBRUIKEN" && (
											<div>{examen?.locatiePlaats}</div>
										)}
									</address>
								</div>

								<div>
									{examen?.organisatorBedrijfsnaam && (
										<div className="text-lg font-bold mt-1 md:mt-2">
											Aanbieder:
										</div>
									)}
									<div>{examen?.organisatorBedrijfsnaam}</div>
									<div>
										{examen?.organisatorStraat} {examen?.organisatorHuisnummer}{" "}
										{examen?.organisatorToevoeging}
									</div>
									<div>{examen?.organisatorPlaats}</div>
									<div>
										<a
											className="underline hover:text-primary transition-colors"
											href={`mailto:${examen?.organisatorEmail}`}
										>
											{examen?.organisatorEmail}
										</a>
									</div>
									<div>
										<a
											className="underline hover:text-primary transition-colors"
											href={`tel:${examen?.organisatorTelefoon}`}
										>
											{examen?.organisatorTelefoon}
										</a>
									</div>
								</div>
							</>
						)}
					</Await>
				</Suspense> */}
          <DialogFooter className="sm:justify-start">
            <DialogClose>{/* <ReturnLink /> */}</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default App;
