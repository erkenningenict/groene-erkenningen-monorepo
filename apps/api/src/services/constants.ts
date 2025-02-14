export const all = '[Alle]'

export enum MeetingTypesEnum {
  '[Alle]' = all,
  Kennisbijeenkomst = 'Kennisbijeenkomst',
  Examen = 'Examen',
}

export enum LocationTypesEnum {
  '[Alle]' = all,
  'Fysieke locatie' = 'Fysieke locatie',
  Webinar = 'Webinar',
}

export const MeetingTypes = [
  { value: all, label: all },
  { value: MeetingTypesEnum.Kennisbijeenkomst, label: 'Kennisbijeenkomst' },
  { value: MeetingTypesEnum.Examen, label: 'Examen' },
] as const

export const nrOfDaysToFetch = 180
