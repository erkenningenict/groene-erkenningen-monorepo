import { valibotResolver } from "@hookform/resolvers/valibot";
import { Alert } from "@repo/ui/alert";
import { Button } from "@repo/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { Skeleton } from "@repo/ui/skeleton";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import Students from "./Students";
import useFetch from "./useFetch";
import type { Student } from "../../api/src/services/check-certificaat.server";
import StudentSkeletons from "./StudentSkeleton";

const formSchema = v.object({
  search: v.pipe(
    v.string(),
    v.minLength(2, "Voer minimaal 2 karakters in"),
    v.maxLength(50, "Voer maximaal 50 karakters in"),
  ),
  certificate: v.pipe(
    v.string("Selecteer een certificaat"),
    v.minLength(1, "Selecteer een certificaat"),
  ),
});
type FormValues = v.InferInput<typeof formSchema>;

type SearchFormProps = {
  label: string;
  certificates: { certificate: string }[];
  isLoadingCertificates: boolean;
  isErrorCertificates: boolean;
};

export default function SearchForm({
  label,
  certificates,
  isLoadingCertificates,
  isErrorCertificates,
}: SearchFormProps) {
  const form = useForm<FormValues>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      search: "",
      certificate: "",
    },
  });
  const [searchValues, setSearchValues] = useState<FormValues>({
    search: "",
    certificate: "",
  });

  function onSubmit(values: FormValues) {
    setSearchValues(values);
  }

  const apiBaseUrl = import.meta.env.VITE_APP_API_URL;
  const {
    data: students,
    isLoading,
    isError,
  } = useFetch<Student[]>(
    `${apiBaseUrl}/publicRegister/certificates/${label}/${searchValues.certificate}/${searchValues.search}`,
    !!searchValues.search && !!searchValues.certificate,
  );

  if (isLoadingCertificates) {
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
  if (isErrorCertificates) {
    return (
      <Alert variant={"destructive"}>
        Er is iets mis gegaan bij het laden van de persoonscertificaten. Probeer
        het later nog eens.
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-80">
                <FormLabel>Zoek op achternaam</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Zoek op achternaam"
                    autoFocus
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Zonder tussenvoegsel, voer min. 2 karakters in
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-2">
            <FormLabel className="mb-1">Selecteer een certificaat</FormLabel>
            <div className="flex flex-col gap-3">
              {certificates.map(({ certificate }) => (
                <div
                  key={certificate}
                  className="flex flex-row gap-2 items-center"
                >
                  <input
                    {...form.register("certificate", {
                      required: "Selecteer een certificaat",
                    })}
                    type="radio"
                    id={certificate}
                    value={certificate}
                    className="w-4 h-4 appearance-none text-primary border border-border rounded-full checked:bg-primary checked:border-border focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />

                  <Label htmlFor={certificate}> {certificate}</Label>
                </div>
              ))}
            </div>
            {form.formState.errors.certificate && (
              <div className="text-sm font-medium text-destructive">
                {form.formState.errors.certificate.message}
              </div>
            )}
          </div>
          <Button type="submit" className="w-fit" disabled={isLoading}>
            Zoeken
          </Button>
        </form>
      </Form>

      {isLoading && (
        <div className="flex flex-col">
          <StudentSkeletons count={1} />
        </div>
      )}

      {isError && (
        <Alert variant={"destructive"}>
          Er is iets mis gegaan bij het zoeken naar de gegevens. Probeer het
          later nog eens.
        </Alert>
      )}

      {students && <Students students={students} />}
    </div>
  );
}
