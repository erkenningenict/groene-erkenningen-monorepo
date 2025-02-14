import { valibotResolver } from "@hookform/resolvers/valibot";
import { all, MeetingTypes, type MeetingTypesEnum } from "@repo/constants";
import { type CalendarStartUpSettings } from "@repo/schemas";
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
import { useForm } from "react-hook-form";
import Results from "./Results";
import { useSearchParams } from "react-router";
import {
  CalendarSearchSchema,
  type CalendarSearch,
} from "./schemas/calendarSearchSchema";
import { MultiSelect } from "@repo/ui/multi-select";
import { useState } from "react";
import { NativeSelect } from "@repo/ui/native-select";

type SearchFormProps = {
  label: string;
  data: CalendarStartUpSettings;
};

export default function SearchForm({ label, data }: SearchFormProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const form = useForm<CalendarSearch>({
    resolver: valibotResolver(CalendarSearchSchema),
    values: {
      meetingType:
        (searchParams.get("meetingType") as MeetingTypesEnum) ??
        (data?.defaultSettings.meetingType as MeetingTypesEnum),
      startDate:
        searchParams.get("startDate") ?? data?.defaultSettings.startDate,
      endDate: searchParams.get("endDate") ?? data?.defaultSettings.endDate,
      certificates:
        searchParams.getAll("certificates") ??
        data?.defaultSettings.certificates,
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
      <div ref={setContainer}></div>
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
                  <FormControl>
                    <NativeSelect
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.handleSubmit(onSubmit)();
                      }}
                    >
                      {MeetingTypes.map((meetingType) => (
                        <option
                          key={meetingType.value}
                          value={meetingType.value}
                        >
                          {meetingType.label}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
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
          {data.certificates.length > 0 && (
            <FormField
              control={form.control}
              name="certificates"
              render={({ field }) => (
                <FormItem className="w-full md:w-80">
                  <FormLabel>Filter type certificaat</FormLabel>
                  <MultiSelect
                    container={container!}
                    options={data.certificates}
                    onValueChange={(e) => {
                      field.onChange(e);
                      form.handleSubmit(onSubmit)();
                    }}
                    defaultValue={field.value}
                    selectAllText={all}
                    showToggleAll
                    clearText="Wissen"
                    closeText="Sluiten"
                    searchInputPlaceholder="Zoeken"
                    placeholder="Kies certificaten"
                    variant={"inverted"}
                    maxDisplayCount={9}
                  />
                  <FormMessage />
                  <FormDescription>
                    {data.calendarHints?.certificates ??
                      "U kunt op meerdere certificaten tegelijk zoeken"}
                  </FormDescription>
                </FormItem>
              )}
            />
          )}
          {data.organisations.length > 0 && (
            <FormField
              control={form.control}
              name="organisation"
              render={({ field }) => (
                <FormItem className="w-full md:w-80">
                  <FormLabel>Kennisaanbieder</FormLabel>
                  <FormControl>
                    <NativeSelect
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.handleSubmit(onSubmit)();
                      }}
                    >
                      {[all].concat(data.organisations).map((organisation) => (
                        <option key={organisation} value={organisation}>
                          {organisation}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
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
                <FormControl>
                  <NativeSelect
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      form.handleSubmit(onSubmit)();
                    }}
                  >
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
                        <option
                          key={locationType.value}
                          value={locationType.value}
                        >
                          {locationType.label}
                        </option>
                      ))}
                  </NativeSelect>
                </FormControl>

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
                  <FormControl>
                    <NativeSelect
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.handleSubmit(onSubmit)();
                      }}
                    >
                      {[all, "5", "10", "25", "50", "100"].map((distance) => (
                        <option key={distance} value={distance.toString()}>
                          {`${distance} km.`}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
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
          <div ref={setContainer}></div>
        </form>
      </Form>
      <Results label={label} certificateTypes={data.certificates} />
    </div>
  );
}
