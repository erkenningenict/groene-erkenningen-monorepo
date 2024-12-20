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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form";
import { Input } from "@repo/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@repo/ui/select";
// import { Select } from "@base-ui-components/react/select";
import {
  Button,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";
import { useForm } from "react-hook-form";
import Results from "./Results";
import { useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

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
        data?.defaultSettings.meetingType,
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
      zipCode: data?.defaultSettings.zipCode,
      distance: searchParams.get("distance") ?? data?.defaultSettings.distance,
    },
  });

  function onSubmit(values: CalendarSearch) {
    console.log("#DH# searchValues", values);

    setSearchParams(values);
  }
  // const portalRoot = useRef<HTMLDivElement>(null);
  const portalRoot = document.getElementById("selectRoot");
  // useEffect(() => {
  //   portalRoot.current = document.getElementById("selectRoot");
  // }, []);
  console.log("#DH# poralR", portalRoot);

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
                  <Select.Root
                    onValueChange={(e) => {
                      console.log("#DH# e", e);
                      field.onChange(e);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <Select.Trigger className="flex h-10 min-w-36 items-center justify-between gap-3 rounded-md border border-gray-200 pr-3 pl-3.5 text-base text-gray-900 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100 data-[popup-open]:bg-gray-100">
                        <Select.Value placeholder="Selecteer een type bijeenkomst" />
                      </Select.Trigger>
                    </FormControl>
                    <Select.Portal container={portalRoot}>
                      <Select.Positioner className="outline-0" sideOffset={8}>
                        <Select.Popup className="group origin-[var(--transform-origin)] rounded-md bg-[canvas] py-1 text-gray-900 shadow-lg shadow-gray-200 outline outline-gray-200 transition-[transform,scale,opacity] dark:shadow-none dark:-outline-offset-1  [[data-starting-style],[data-ending-style]]:scale-90 [[data-starting-style],[data-ending-style]]:opacity-0 data-[side=none]:[[data-starting-style],[data-ending-style]]:scale-100 data-[side=none]:[[data-starting-style],[data-ending-style]]:opacity-100 data-[side=none]:[[data-starting-style],[data-ending-style]]:transition-none">
                          <Select.Arrow className="data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=left]:rotate-90 data-[side=right]:left-[-13px] data-[side=right]:-rotate-90 data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180">
                            {/* <ArrowSvg /> */}
                            <ChevronDown />
                          </Select.Arrow>
                          {MeetingTypes.map((meetingType) => (
                            <Select.Item
                              className="grid min-w-[var(--anchor-width)] cursor-default grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-4 pl-2.5 text-sm leading-4 outline-0 select-none group-data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)] group-data-[side=none]:pr-12 group-data-[side=none]:text-base group-data-[side=none]:leading-4 data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:-z-1 data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-slate-800"
                              value={meetingType.value}
                              key={meetingType.value}
                            >
                              <Select.ItemIndicator className="col-start-1">
                                <Check className="size-3" />
                              </Select.ItemIndicator>
                              <Select.ItemText className="col-start-2">
                                {meetingType.label}
                              </Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Popup>
                      </Select.Positioner>
                    </Select.Portal>
                  </Select.Root>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          {/* 
          
                    <FormField
            control={form.control}
            name="meetingType"
            render={({ field }) => (
              <>
                <FormItem className="w-full md:w-80">
                  <FormLabel>Type bijeenkomst</FormLabel>
                  <Select
                    onValueChange={field.onChange}
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
                  onValueChange={field.onChange}
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
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organisation"
            render={({ field }) => (
              <FormItem className="w-full md:w-80">
                <FormLabel>Kennisaanbieder</FormLabel>
                <Select
                  onValueChange={field.onChange}
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
          <FormField
            control={form.control}
            name="locationType"
            render={({ field }) => (
              <FormItem className="w-full md:w-80">
                <FormLabel>Locatie type</FormLabel>
                <Select
                  onValueChange={field.onChange}
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
          /> */}
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
            {/* <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem className="w-full md:w-28">
                  <FormLabel>Max. afstand</FormLabel>
                  <Select
                    onValueChange={field.onChange}
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
            /> */}
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
      <Results label={label} />
    </div>
  );
}
