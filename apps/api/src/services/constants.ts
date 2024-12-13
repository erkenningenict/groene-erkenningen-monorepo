export const all = "[Alle]";

export enum MeetingTypesEnum {
  Alle = all,
  Kennisbijeenkomst = "Kennisbijeenkomst",
  Examen = "Examen",
}

export const MeetingTypes = [
  { value: all, label: all },
  { value: MeetingTypesEnum.Kennisbijeenkomst, label: "Kennisbijeenkomst" },
  { value: MeetingTypesEnum.Examen, label: "Examen" },
] as const;
