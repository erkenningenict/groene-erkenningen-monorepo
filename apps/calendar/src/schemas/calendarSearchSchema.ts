import { all, MeetingTypesEnum } from "@repo/constants";
import * as v from "valibot";

// v.pipe(
export const CalendarSearchSchema = v.pipe(
  v.object({
    meetingType: v.optional(v.enum(MeetingTypesEnum), MeetingTypesEnum.Alle),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    certificates: v.optional(v.array(v.string()), []),
    organisation: v.optional(v.string(), all),
    locationType: v.optional(v.string(), all),
    search: v.optional(v.string(), ""),
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
  v.forward(
    v.check((input) => {
      if (
        input.startDate &&
        input.endDate &&
        input.startDate &&
        input.endDate &&
        new Date(input.startDate) > new Date(input.endDate)
      ) {
        return false;
      }
      return true;
    }, "Begindatum moet voor einddatum liggen"),
    ["startDate"],
  ),
);
export type CalendarSearch = v.InferOutput<typeof CalendarSearchSchema>;
export type CalendarSearchInput = v.InferInput<typeof CalendarSearchSchema>;
