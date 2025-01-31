import { MeetingTypes, MeetingTypesEnum } from "@repo/constants";
import * as v from "valibot";

export const CalendarStartUpSettingsSchema = v.object({
  certificates: v.array(
    v.object({
      value: v.string(),
      label: v.string(),
    }),
  ),
  organisations: v.array(v.string()),
  defaultSettings: v.object({
    meetingType: v.optional(v.enum(MeetingTypesEnum), MeetingTypesEnum.Alle),
    startDate: v.string(),
    endDate: v.string(),
    certificates: v.array(v.string()),
    organisation: v.string(),
    locationType: v.string(),
    search: v.string(),
    zipCode: v.string(),
    distance: v.string(),
  }),
  calendarHints: v.object({
    certificates: v.optional(v.string()),
  }),
});

export type CalendarStartUpSettings = v.InferOutput<
  typeof CalendarStartUpSettingsSchema
>;
