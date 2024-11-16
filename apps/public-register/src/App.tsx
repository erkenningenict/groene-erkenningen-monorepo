import { zodResolver } from "@hookform/resolvers/zod";
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
import { z } from "zod";
import { Input } from "@repo/ui/input";
import { RadioGroup, RadioGroupItem } from "@repo/ui/radio-group";
import { getCertificates } from "./api";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@repo/ui/spinner";

const formSchema = z.object({
  search: z
    .string()
    .min(2, { message: "Voer minimaal 2 karakters in" })
    .max(50, { message: "Voer maximaal 50 karakters in" }),
  certificate: z.string(),
});

function App() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  });

  const {
    data: certificates,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["certificates"],
    queryFn: () => getCertificates("Groenkeur"),
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="flex p-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zoek op achternaam</FormLabel>
                <FormControl>
                  <Input placeholder="Zoek op achternaam" {...field} />
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
                <FormLabel>Persoonscertificaten</FormLabel>
                {isLoading && <Spinner />}
                {isError && <p>Error loading certificates</p>}
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {/* <ul
        aria-label="Search results"
        data-testid="search-results"
        className="flex flex-col gap-3 mt-3"
      >
        {students?.length === 0 ? (
          <Alert type="warning">
            Er zijn geen resultaten beschikbaar. Pas de zoekcriteria aan.
          </Alert>
        ) : (
          students?.map((student, index) => (
            <li
              key={`${student?.id}${index}`}
              className="border-t border-gray-500 pt-3"
            >
              <div className="text-primary text-xl">
                {student?.initialen} {student?.achternaam}
              </div>
              <div>Geboortejaar: {student?.geboorteJaar}</div>
              <div className="flex gap-2">
                <IconCircleCheck className="shrink-0" />
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
      </ul> */}
    </div>
  );
}

export default App;
