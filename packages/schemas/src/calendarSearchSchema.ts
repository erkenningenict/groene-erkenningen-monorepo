import * as v from "valibot";
import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { all, MeetingTypesEnum } from "@repo/constants";

export const CalendarSearchSchema = v.object({
  meetingType: v.optional(v.enum(MeetingTypesEnum), MeetingTypesEnum.Alle),
  startDate: v.optional(
    v.string(),
    // v.transform((input: string) => startOfDay(new Date(input))),
    // v.date(),
  ),
  endDate: v.optional(v.string()),
  // endDate: v.optional(
  //   v.pipe(
  //     v.string(),
  //     v.transform((input: string) => endOfDay(new Date(input))),
  //     v.date(),
  //   ),
  //   format(endOfDay(addDays(new Date(), 180)), "yyyy-MM-dd"),
  // ),
  certificate: v.optional(v.string(), all),
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
});

export type CalendarSearch = v.InferOutput<typeof CalendarSearchSchema>;
