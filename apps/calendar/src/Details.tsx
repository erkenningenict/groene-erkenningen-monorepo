import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@repo/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import { useCallback, useRef } from "react";
import { ExamDetails } from "./components/exam-details";
import type { SelectedExam } from "./Results";

type DetailsProps = {
  label: string;
  selectedExam: SelectedExam;
  onClose: () => void;
  container: HTMLDivElement | null;
};

export function Details({
  label,
  selectedExam,
  onClose,
  container,
}: DetailsProps) {
  const previousFocusRef = useRef<Element | null>(null);

  const shadowHost = document.querySelector("fw-calendar");

  previousFocusRef.current = shadowHost?.shadowRoot?.activeElement ?? null;

  const handleCloseModal = useCallback(() => {
    setTimeout(() => {
      if (
        previousFocusRef.current &&
        previousFocusRef.current instanceof HTMLElement
      ) {
        previousFocusRef.current.focus();
      }
      // timeout needed to be able to set the focus after the modal animation is finished
    }, 150);
    onClose();
  }, []);

  const ReturnLink = () => {
    return (
      <Button
        variant={"secondary"}
        onClick={handleCloseModal}
        className="flex gap-2 items-center"
      >
        Sluiten
      </Button>
    );
  };

  return (
    <DialogContent container={container}>
      <DialogHeader>
        <VisuallyHidden>
          <DialogTitle>Details</DialogTitle>
        </VisuallyHidden>
      </DialogHeader>
      <ExamDetails label={label} params={selectedExam} />

      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <ReturnLink />
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
