import * as v from "valibot";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { all, MeetingTypesEnum } from "@repo/constants";

const StringOrNullSchema = v.pipe(
  v.nullable(v.string()),
  v.transform((value) => (value === "null" ? "" : value?.trim() || "")),
);
const StringOrNullToAllSchema = v.pipe(
  v.nullable(v.string()),
  v.transform((value) => (value === "null" ? all : value?.trim() || "")),
);

export const CalendarSearchSchema = v.pipe(
  v.object({
    meetingType: v.optional(v.enum(MeetingTypesEnum), MeetingTypesEnum.Alle),
    startDate: v.optional(
      v.string(),
      // v.transform((input: string) => startOfDay(new Date(input))),
      // v.date(),
    ),
    // startDate: v.pipe(
    //   StringOrNullSchema,
    //   v.transform((input: string) => {
    //     console.log("#DH# input", input);
    //     if (input === "") {
    //       return startOfDay(new Date());
    //     } else {
    //       const date = startOfDay(new Date(input));
    //       if (date >= startOfDay(new Date())) {
    //         return startOfDay(new Date());
    //       }
    //       return date.toISOString();
    //     }
    //   }),
    //   v.string(),
    //   // v.custom(value => {
    //   //   console.log('#DH# value', value)
    //   //   if (isDate(value)) {
    //   //     if (value >= startOfDay(new Date())) {
    //   //       return startOfDay(new Date())
    //   //     }
    //   //   }
    //   //   return false
    //   // }, 'Start date must not be in the past'),
    // ),
    endDate: v.optional(v.string()),
    // endDate: v.optional(
    //   v.pipe(
    //     v.string(),
    //     v.transform((input: string) => endOfDay(new Date(input))),
    //     v.date(),
    //   ),
    //   format(endOfDay(addDays(new Date(), 180)), "yyyy-MM-dd"),
    // ),
    certificates: v.optional(v.array(v.string()), []),
    organisation: v.optional(v.string(), all),
    locationType: v.optional(v.string(), all),
    search: v.optional(v.string(), ""),
    // zipCode: v.optional(
    //   v.pipe(v.string(), v.regex(/[1-9]{1}[0-9]{3}/, "Vul 4 cijfers in")),
    // ),
    zipCode: v.union([
      v.literal(""),
      v.pipe(
        v.string(),
        v.regex(
          /[1-9]{1}[0-9]{3}/,
          "Vul 4 cijfers van een correcte postcode in (bijv. 1234)",
        ),
      ),
    ]),
    distance: v.optional(v.string(), all),
  }),
  v.check((input) => {
    if (input.startDate && input.endDate && input.startDate > input.endDate) {
      return false;
    }
    return true;
  }, "Start date must not be after end date"),
);

export type CalendarSearch = v.InferOutput<typeof CalendarSearchSchema>;
