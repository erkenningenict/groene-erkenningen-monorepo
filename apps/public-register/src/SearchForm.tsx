import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
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
import * as v from "valibot";
import { Input } from "@repo/ui/input";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import { useState } from "react";
import { Alert } from "@repo/ui/alert";
import { Skeleton } from "@repo/ui/skeleton";
import Students from "./Students";
import type { SearchValues } from "./types";

const formSchema = v.object({
  search: v.pipe(
    v.string(),
    v.minLength(2, "Voer minimaal 2 karakters in"),
    v.maxLength(50, "Voer maximaal 50 karakters in"),
  ),
  certificate: v.string(),
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
          <FormField
            control={form.control}
            name="certificate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kies een persoonscertificaat</FormLabel>

                {certificates?.length === 0 && (
                  <Alert variant={"destructive"}>
                    Er zijn geen persoonscertificaten gevonden. Neem contact op
                    met de beheerder.
                  </Alert>
                )}

                {certificates && (
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      {certificates?.map(({ certificate }) => (
                        <FormItem
                          key={certificate}
                          className="flex items-center space-x-3 space-y-0"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              form.handleSubmit(onSubmit)();
                            }
                          }}
                        >
                          <FormControl>
                            <RadioGroupItem value={certificate} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {certificate}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              </FormItem>
            )}
          />
          <Button type="submit">Zoeken</Button>
        </form>
      </Form>
      <Students label={label} searchValues={searchValues} />
    </div>
  );
}
