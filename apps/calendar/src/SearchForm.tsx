import { valibotResolver } from "@hookform/resolvers/valibot";
import { all, MeetingTypes, type MeetingTypesEnum } from "@repo/constants";
import {
  CalendarSearchSchema,
  type CalendarSearch,
  type CalendarStartUpSettings,
} from "@repo/schemas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select";
import { useForm } from "react-hook-form";
import Results from "./Results";
import { useSearchParams } from "react-router";

type SearchFormProps = {
  label: string;
  data: CalendarStartUpSettings;
};

export default function SearchForm({ label, data }: SearchFormProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const form = useForm<CalendarSearch>({
    resolver: valibotResolver(CalendarSearchSchema),
    values: {
      meetingType:
        (searchParams.get("meetingType") as MeetingTypesEnum) ??
        (data?.defaultSettings.meetingType as MeetingTypesEnum),
      startDate:
        searchParams.get("startDate") ?? data?.defaultSettings.startDate,
      endDate: searchParams.get("endDate") ?? data?.defaultSettings.endDate,
      certificate:
        searchParams.get("certificate") ?? data?.defaultSettings.certificate,
      organisation:
        searchParams.get("organisation") ?? data?.defaultSettings.organisation,
      locationType:
        searchParams.get("locationType") ?? data?.defaultSettings.locationType,
      search: searchParams.get("search") ?? data?.defaultSettings.search,
      zipCode: searchParams.get("zipCode") ?? data?.defaultSettings.zipCode,
      distance: searchParams.get("distance") ?? data?.defaultSettings.distance,
    },
  });

  function onSubmit(values: CalendarSearch) {
    setSearchParams(values);
  }

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 w-full"
        >
          <FormField
            control={form.control}
            name="meetingType"
            render={({ field }) => (
              <>
                <FormItem className="w-full md:w-80">
                  <FormLabel>Type bijeenkomst</FormLabel>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e);
                      form.handleSubmit(onSubmit)();
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer een type bijeenkomst" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MeetingTypes.map((meetingType) => (
                        <SelectItem
                          key={meetingType.value}
                          value={meetingType.value}
                        >
                          {meetingType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />

          <div className="grid grid-cols-2 gap-4 w-full md:w-80">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Begindatum</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Voer de begindatum in"
                      type="date"
                      min="2020-01-01"
                      max={"2030-01-01"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="w-ful">
                  <FormLabel>Einddatum</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Voer de einddatum in"
                      type="date"
                      min="2020-01-01"
                      max={"2030-01-01"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="certificate"
            render={({ field }) => (
              <FormItem className="w-full md:w-80">
                <FormLabel>Type certificaat</FormLabel>
                <Select
                  onValueChange={(e) => {
                    field.onChange(e);
                    form.handleSubmit(onSubmit)();
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een type certificaat" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[{ value: all, label: all }]
                      .concat(data.certificates)
                      .map((certificate) => (
                        <SelectItem
                          key={certificate.value}
                          value={certificate.value}
                        >
                          {certificate.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
                <FormDescription>
                  U kunt ook UG + BG samen selecteren.
                </FormDescription>
              </FormItem>
            )}
          />
          {data.organisations.length > 0 && (
            <FormField
              control={form.control}
              name="organisation"
              render={({ field }) => (
                <FormItem className="w-full md:w-80">
                  <FormLabel>Kennisaanbieder</FormLabel>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e);
                      form.handleSubmit(onSubmit)();
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer een organisatie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[all].concat(data.organisations).map((organisation) => (
                        <SelectItem key={organisation} value={organisation}>
                          {organisation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="locationType"
            render={({ field }) => (
              <FormItem className="w-full md:w-80">
                <FormLabel>Locatie type</FormLabel>
                <Select
                  onValueChange={(e) => {
                    field.onChange(e);
                    form.handleSubmit(onSubmit)();
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer locatie type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[
                      { value: "[Alle]", label: "[Alle]" },
                      { value: "Fysieke locatie", label: "Fysieke locatie" },
                      { value: "Online", label: "Online" },
                      { value: "Webinar", label: "Webinar" },
                    ]
                      .filter((val) => {
                        if (val.value === "Online") {
                          return label.toLowerCase() === "Gewasbescherming";
                        }
                        return true;
                      })
                      .map((locationType) => (
                        <SelectItem
                          key={locationType.value}
                          value={locationType.value}
                        >
                          {locationType.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-full md:w-80">
                <FormLabel>Zoek op titel, locatie, plaats</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Zoek op titel, locatie, plaats"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-row flex-wrap gap-3">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem className="w-full md:w-80">
                  <FormLabel>Zoek met cijfers van uw postcode</FormLabel>
                  <FormControl>
                    <Input placeholder="Bijv. 1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem className="w-full md:w-28">
                  <FormLabel>Max. afstand</FormLabel>
                  <Select
                    onValueChange={(e) => {
                      field.onChange(e);
                      form.handleSubmit(onSubmit)();
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer een maximale afstand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[all, "5", "10", "25", "50", "100"].map((distance) => (
                        <SelectItem key={distance} value={distance.toString()}>
                          {`${distance} km.`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {form.formState.errors && (
            <div className="text-red-500">
              {Object.keys(form.formState.errors).map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}

          <Button type="submit" className="w-fit">
            Zoeken
          </Button>
        </form>
      </Form>
      <Results label={label} certificateTypes={data.certificates} />
    </div>
  );
}
