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
import type { SearchValues } from "./types";

const formSchema = v.object({
  search: v.pipe(
    v.string(),
    v.minLength(2, "Voer minimaal 2 karakters in"),
    v.maxLength(50, "Voer maximaal 50 karakters in"),
  ),
  certificate: v.pipe(v.string(), v.minLength(1, "Selecteer een certificaat")),
});

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
  const form = useForm<v.InferOutput<typeof formSchema>>({
    resolver: valibotResolver(formSchema),
    defaultValues: {
      search: "",
      certificate: "",
    },
  });
  const [searchValues, setSearchValues] = useState<SearchValues>({
    search: "",
    certificate: "",
  });

  function onSubmit(values: v.InferOutput<typeof formSchema>) {
    setSearchValues(values);
  }

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <FormLabel>Selecteer een certificaat</FormLabel>
          {certificates.map(({ certificate }) => (
            <div key={certificate} className="flex flex-row gap-2 items-center">
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
          {form.formState.errors.certificate && (
            <div className="text-sm font-medium text-destructive">
              {form.formState.errors.certificate.message}
            </div>
          )}

          <Button type="submit">Zoeken</Button>
        </form>
      </Form>
      <Students label={label} searchValues={searchValues} />
    </div>
  );
}
